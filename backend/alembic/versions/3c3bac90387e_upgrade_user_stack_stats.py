"""upgrade user stack stats

Revision ID: 3c3bac90387e
Revises: 573aa5005d5c
Create Date: 2026-06-01 20:44:25.861525

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '3c3bac90387e'
down_revision: Union[str, Sequence[str], None] = '573aa5005d5c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    op.add_column(
        'user_stack_stats',
        sa.Column(
            'live_projects_count',
            sa.Integer(),
            nullable=False,
            server_default="0",
        )
    )

    op.add_column(
        'user_stack_stats',
        sa.Column(
            'journal_entries_count',
            sa.Integer(),
            nullable=False,
            server_default="0",
        )
    )

    op.add_column(
        'user_stack_stats',
        sa.Column(
            'score',
            sa.Integer(),
            nullable=False,
            server_default="0",
        )
    )

    op.add_column(
        'user_stack_stats',
        sa.Column(
            'level',
            sa.Integer(),
            nullable=False,
            server_default="1",
        )
    )

    op.add_column(
        'user_stack_stats',
        sa.Column(
            'last_used_at',
            sa.DateTime(timezone=True),
            nullable=True,
        )
    )


def downgrade() -> None:

    op.drop_column(
        'user_stack_stats',
        'last_used_at'
    )

    op.drop_column(
        'user_stack_stats',
        'level'
    )

    op.drop_column(
        'user_stack_stats',
        'score'
    )

    op.drop_column(
        'user_stack_stats',
        'journal_entries_count'
    )

    op.drop_column(
        'user_stack_stats',
        'live_projects_count'
    )