"""add support tickets

Revision ID: 2ed7a43da1d6
Revises: 2797d7a9fb2a
Create Date: 2026-06-07 18:33:03.902318
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "2ed7a43da1d6"
down_revision: Union[str, Sequence[str], None] = "2797d7a9fb2a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    bind = op.get_bind()
    inspector = sa.inspect(bind)

    # If table already exists, don't recreate anything.
    # This protects you from half-broken migration states.
    if "support_tickets" in inspector.get_table_names():
        return

    # =========================================================
    # SEQUENCE FOR HUMAN TICKET NUMBER
    # CG-0001, CG-0002, etc.
    # =========================================================

    op.execute(
        "CREATE SEQUENCE IF NOT EXISTS support_ticket_seq START 1"
    )

    # =========================================================
    # ENUM TYPES
    # PostgreSQL enums are annoying. Create safely if missing.
    # =========================================================

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

    # =========================================================
    # SUPPORT TICKETS TABLE
    # =========================================================

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

    # =========================================================
    # INDEXES
    # =========================================================

    op.create_index(
        "ix_support_tickets_ticket_number",
        "support_tickets",
        ["ticket_number"],
        unique=True,
    )

    op.create_index(
        "ix_support_tickets_user_id",
        "support_tickets",
        ["user_id"],
        unique=False,
    )

    op.create_index(
        "ix_support_tickets_project_id",
        "support_tickets",
        ["project_id"],
        unique=False,
    )

    op.create_index(
        "ix_support_tickets_status",
        "support_tickets",
        ["status"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.execute(
        "DROP INDEX IF EXISTS ix_support_tickets_status"
    )

    op.execute(
        "DROP INDEX IF EXISTS ix_support_tickets_project_id"
    )

    op.execute(
        "DROP INDEX IF EXISTS ix_support_tickets_user_id"
    )

    op.execute(
        "DROP INDEX IF EXISTS ix_support_tickets_ticket_number"
    )

    op.execute(
        "DROP TABLE IF EXISTS support_tickets"
    )

    op.execute(
        "DROP SEQUENCE IF EXISTS support_ticket_seq"
    )

    op.execute(
        "DROP TYPE IF EXISTS ticket_priority"
    )

    op.execute(
        "DROP TYPE IF EXISTS ticket_status"
    )

    op.execute(
        "DROP TYPE IF EXISTS ticket_category"
    )