"""add feedback

Revision ID: a5731d1d0aee
Revises: 54582825b0fb
Create Date: 2026-06-07 19:30:25.652259
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "a5731d1d0aee"
down_revision: Union[str, Sequence[str], None] = "54582825b0fb"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    # =========================================================
    # CREATE ENUMS SAFELY
    # =========================================================

    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'idea_category'
        ) THEN
            CREATE TYPE idea_category AS ENUM (
                'feature',
                'integration',
                'improvement',
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
            SELECT 1 FROM pg_type WHERE typname = 'idea_status'
        ) THEN
            CREATE TYPE idea_status AS ENUM (
                'open',
                'under_review',
                'planned',
                'shipped',
                'declined'
            );
        END IF;
    END
    $$;
    """)

    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'feedback_type'
        ) THEN
            CREATE TYPE feedback_type AS ENUM (
                'general',
                'bug',
                'idea',
                'ux',
                'praise',
                'complaint'
            );
        END IF;
    END
    $$;
    """)

    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'feedback_status'
        ) THEN
            CREATE TYPE feedback_status AS ENUM (
                'new',
                'reviewed',
                'planned',
                'shipped',
                'archived'
            );
        END IF;
    END
    $$;
    """)

    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'feedback_sentiment'
        ) THEN
            CREATE TYPE feedback_sentiment AS ENUM (
                'positive',
                'neutral',
                'negative'
            );
        END IF;
    END
    $$;
    """)

    idea_category = postgresql.ENUM(
        name="idea_category",
        create_type=False,
    )

    idea_status = postgresql.ENUM(
        name="idea_status",
        create_type=False,
    )

    feedback_type = postgresql.ENUM(
        name="feedback_type",
        create_type=False,
    )

    feedback_status = postgresql.ENUM(
        name="feedback_status",
        create_type=False,
    )

    feedback_sentiment = postgresql.ENUM(
        name="feedback_sentiment",
        create_type=False,
    )

    # =========================================================
    # IDEAS TABLE
    # =========================================================

    if "ideas" not in inspector.get_table_names():
        op.create_table(
            "ideas",

            sa.Column(
                "id",
                sa.Integer(),
                nullable=False,
            ),

            sa.Column(
                "title",
                sa.String(length=140),
                nullable=False,
            ),

            sa.Column(
                "description",
                sa.Text(),
                nullable=False,
            ),

            sa.Column(
                "category",
                idea_category,
                nullable=True,
            ),

            sa.Column(
                "status",
                idea_status,
                nullable=False,
                server_default="open",
            ),

            sa.Column(
                "upvotes",
                sa.Integer(),
                nullable=False,
                server_default="0",
            ),

            sa.Column(
                "clerk_user_id",
                sa.String(),
                nullable=True,
            ),

            sa.Column(
                "contact_email",
                sa.String(),
                nullable=True,
            ),

            sa.Column(
                "page_url",
                sa.String(),
                nullable=True,
            ),

            sa.Column(
                "diagnostics",
                postgresql.JSONB(astext_type=sa.Text()),
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

            sa.PrimaryKeyConstraint("id"),
        )

        op.create_index(
            "ix_ideas_clerk_user_id",
            "ideas",
            ["clerk_user_id"],
            unique=False,
        )

    # =========================================================
    # FEEDBACK TABLE
    # =========================================================

    if "feedback" not in inspector.get_table_names():
        op.create_table(
            "feedback",

            sa.Column(
                "id",
                postgresql.UUID(as_uuid=True),
                nullable=False,
            ),

            sa.Column(
                "user_id",
                postgresql.UUID(as_uuid=True),
                nullable=True,
            ),

            sa.Column(
                "feedback_type",
                feedback_type,
                nullable=False,
                server_default="general",
            ),

            sa.Column(
                "status",
                feedback_status,
                nullable=False,
                server_default="new",
            ),

            sa.Column(
                "sentiment",
                feedback_sentiment,
                nullable=False,
                server_default="neutral",
            ),

            sa.Column(
                "rating",
                sa.Integer(),
                nullable=True,
            ),

            sa.Column(
                "title",
                sa.String(length=140),
                nullable=False,
            ),

            sa.Column(
                "message",
                sa.Text(),
                nullable=False,
            ),

            sa.Column(
                "page_url",
                sa.String(length=500),
                nullable=True,
            ),

            sa.Column(
                "source",
                sa.String(length=80),
                nullable=False,
                server_default="feedback_page",
            ),

            sa.Column(
                "allow_contact",
                sa.Boolean(),
                nullable=False,
                server_default=sa.text("false"),
            ),

            sa.Column(
                "contact_email",
                sa.String(length=255),
                nullable=True,
            ),

            sa.Column(
                "diagnostics",
                postgresql.JSONB(astext_type=sa.Text()),
                nullable=True,
            ),

            sa.Column(
                "admin_notes",
                sa.Text(),
                nullable=True,
            ),

            sa.Column(
                "reviewed_at",
                sa.DateTime(timezone=True),
                nullable=True,
            ),

            sa.Column(
                "reviewed_by_user_id",
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
                ["reviewed_by_user_id"],
                ["users.id"],
                ondelete="SET NULL",
            ),

            sa.ForeignKeyConstraint(
                ["user_id"],
                ["users.id"],
                ondelete="SET NULL",
            ),

            sa.PrimaryKeyConstraint("id"),
        )

        op.create_index(
            "ix_feedback_feedback_type",
            "feedback",
            ["feedback_type"],
            unique=False,
        )

        op.create_index(
            "ix_feedback_sentiment",
            "feedback",
            ["sentiment"],
            unique=False,
        )

        op.create_index(
            "ix_feedback_status",
            "feedback",
            ["status"],
            unique=False,
        )

        op.create_index(
            "ix_feedback_user_id",
            "feedback",
            ["user_id"],
            unique=False,
        )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_feedback_user_id")
    op.execute("DROP INDEX IF EXISTS ix_feedback_status")
    op.execute("DROP INDEX IF EXISTS ix_feedback_sentiment")
    op.execute("DROP INDEX IF EXISTS ix_feedback_feedback_type")
    op.execute("DROP TABLE IF EXISTS feedback")

    op.execute("DROP INDEX IF EXISTS ix_ideas_clerk_user_id")
    op.execute("DROP TABLE IF EXISTS ideas")

    op.execute("DROP TYPE IF EXISTS feedback_sentiment")
    op.execute("DROP TYPE IF EXISTS feedback_status")
    op.execute("DROP TYPE IF EXISTS feedback_type")

    op.execute("DROP TYPE IF EXISTS idea_status")
    op.execute("DROP TYPE IF EXISTS idea_category")