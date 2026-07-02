from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# keep your generated IDs here
revision: str = "eed7a116b954"
down_revision: Union[str, Sequence[str], None] = "a5731d1d0aee"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    op.execute(
        "CREATE SEQUENCE IF NOT EXISTS support_ticket_seq START 1"
    )

    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'ticket_category'
        ) THEN
            CREATE TYPE ticket_category AS ENUM (
                'bug',
                'account',
                'integration',
                'feature_not_working',
                'other'
            );
        END IF;
    END
    $$;
    """)

    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'ticket_status'
        ) THEN
            CREATE TYPE ticket_status AS ENUM (
                'open',
                'in_progress',
                'waiting_on_user',
                'resolved',
                'closed'
            );
        END IF;
    END
    $$;
    """)

    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'ticket_priority'
        ) THEN
            CREATE TYPE ticket_priority AS ENUM (
                'low',
                'normal',
                'high',
                'urgent'
            );
        END IF;
    END
    $$;
    """)

    ticket_category = postgresql.ENUM(
        name="ticket_category",
        create_type=False,
    )

    ticket_status = postgresql.ENUM(
        name="ticket_status",
        create_type=False,
    )

    ticket_priority = postgresql.ENUM(
        name="ticket_priority",
        create_type=False,
    )

    if "support_tickets" not in inspector.get_table_names():
        op.create_table(
            "support_tickets",

            sa.Column(
                "id",
                postgresql.UUID(as_uuid=True),
                nullable=False,
            ),

            sa.Column(
                "ticket_number",
                sa.String(length=16),
                nullable=False,
            ),

            sa.Column(
                "user_id",
                postgresql.UUID(as_uuid=True),
                nullable=True,
            ),

            sa.Column(
                "project_id",
                postgresql.UUID(as_uuid=True),
                nullable=True,
            ),

            sa.Column(
                "category",
                ticket_category,
                nullable=False,
            ),

            sa.Column(
                "subject",
                sa.String(length=120),
                nullable=False,
            ),

            sa.Column(
                "description",
                sa.Text(),
                nullable=False,
            ),

            sa.Column(
                "status",
                ticket_status,
                nullable=False,
                server_default="open",
            ),

            sa.Column(
                "priority",
                ticket_priority,
                nullable=False,
                server_default="normal",
            ),

            sa.Column(
                "diagnostics",
                postgresql.JSONB(astext_type=sa.Text()),
                nullable=True,
            ),

            sa.Column(
                "internal_notes",
                sa.Text(),
                nullable=True,
            ),

            sa.Column(
                "resolved_at",
                sa.DateTime(timezone=True),
                nullable=True,
            ),

            sa.Column(
                "resolved_by_user_id",
                postgresql.UUID(as_uuid=True),
                nullable=True,
            ),

            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("now()"),
                nullable=False,
            ),

            sa.Column(
                "updated_at",
                sa.DateTime(timezone=True),
                server_default=sa.text("now()"),
                nullable=False,
            ),

            sa.ForeignKeyConstraint(
                ["user_id"],
                ["users.id"],
                ondelete="SET NULL",
            ),

            sa.ForeignKeyConstraint(
                ["project_id"],
                ["projects.id"],
                ondelete="SET NULL",
            ),

            sa.ForeignKeyConstraint(
                ["resolved_by_user_id"],
                ["users.id"],
                ondelete="SET NULL",
            ),

            sa.PrimaryKeyConstraint("id"),
        )

    op.execute("""
    CREATE UNIQUE INDEX IF NOT EXISTS
    ix_support_tickets_ticket_number
    ON support_tickets (ticket_number)
    """)

    op.execute("""
    CREATE INDEX IF NOT EXISTS
    ix_support_tickets_user_id
    ON support_tickets (user_id)
    """)

    op.execute("""
    CREATE INDEX IF NOT EXISTS
    ix_support_tickets_project_id
    ON support_tickets (project_id)
    """)

    op.execute("""
    CREATE INDEX IF NOT EXISTS
    ix_support_tickets_status
    ON support_tickets (status)
    """)


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_support_tickets_status")
    op.execute("DROP INDEX IF EXISTS ix_support_tickets_project_id")
    op.execute("DROP INDEX IF EXISTS ix_support_tickets_user_id")
    op.execute("DROP INDEX IF EXISTS ix_support_tickets_ticket_number")

    op.execute("DROP TABLE IF EXISTS support_tickets")

    op.execute("DROP SEQUENCE IF EXISTS support_ticket_seq")

    op.execute("DROP TYPE IF EXISTS ticket_priority")
    op.execute("DROP TYPE IF EXISTS ticket_status")
    op.execute("DROP TYPE IF EXISTS ticket_category")