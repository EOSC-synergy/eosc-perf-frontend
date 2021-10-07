"""empty message

Revision ID: 8e4476bb8302
Revises: 
Create Date: 2021-10-06 07:44:33.303063

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '8e4476bb8302'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('submit',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('resource_type', sa.String(), nullable=False),
    sa.Column('upload_datetime', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('tag',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('name', sa.Text(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('user',
    sa.Column('sub', sa.Text(), nullable=False),
    sa.Column('iss', sa.Text(), nullable=False),
    sa.Column('email', sa.Text(), nullable=False),
    sa.Column('registration_datetime', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('sub', 'iss'),
    sa.UniqueConstraint('sub', 'iss')
    )
    op.create_table('benchmark',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('uploader_sub', sa.Text(), nullable=False),
    sa.Column('uploader_iss', sa.Text(), nullable=False),
    sa.Column('upload_datetime', sa.DateTime(), nullable=False),
    sa.Column('status', sa.Enum('on_review', 'approved', name='resourcestatus'), nullable=True),
    sa.Column('docker_image', sa.Text(), nullable=False),
    sa.Column('docker_tag', sa.Text(), nullable=False),
    sa.Column('json_schema', postgresql.JSON(astext_type=sa.Text()), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('_submit_report_id', postgresql.UUID(as_uuid=True), nullable=True),
    sa.ForeignKeyConstraint(['_submit_report_id'], ['submit.id'], ),
    sa.ForeignKeyConstraint(['uploader_iss', 'uploader_sub'], ['user.iss', 'user.sub'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('docker_image', 'docker_tag')
    )
    op.create_table('site',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('uploader_sub', sa.Text(), nullable=False),
    sa.Column('uploader_iss', sa.Text(), nullable=False),
    sa.Column('upload_datetime', sa.DateTime(), nullable=False),
    sa.Column('status', sa.Enum('on_review', 'approved', name='resourcestatus'), nullable=True),
    sa.Column('name', sa.Text(), nullable=False),
    sa.Column('address', sa.Text(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('_submit_report_id', postgresql.UUID(as_uuid=True), nullable=True),
    sa.ForeignKeyConstraint(['_submit_report_id'], ['submit.id'], ),
    sa.ForeignKeyConstraint(['uploader_iss', 'uploader_sub'], ['user.iss', 'user.sub'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('flavor',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('uploader_sub', sa.Text(), nullable=False),
    sa.Column('uploader_iss', sa.Text(), nullable=False),
    sa.Column('upload_datetime', sa.DateTime(), nullable=False),
    sa.Column('status', sa.Enum('on_review', 'approved', name='resourcestatus'), nullable=True),
    sa.Column('name', sa.Text(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('site_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('_submit_report_id', postgresql.UUID(as_uuid=True), nullable=True),
    sa.ForeignKeyConstraint(['_submit_report_id'], ['submit.id'], ),
    sa.ForeignKeyConstraint(['site_id'], ['site.id'], ),
    sa.ForeignKeyConstraint(['uploader_iss', 'uploader_sub'], ['user.iss', 'user.sub'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('site_id', 'name')
    )
    op.create_table('result',
    sa.Column('deleted', sa.Boolean(), nullable=False),
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('uploader_sub', sa.Text(), nullable=False),
    sa.Column('uploader_iss', sa.Text(), nullable=False),
    sa.Column('upload_datetime', sa.DateTime(), nullable=False),
    sa.Column('json', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    sa.Column('execution_datetime', sa.DateTime(), nullable=False),
    sa.Column('benchmark_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('flavor_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('site_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.ForeignKeyConstraint(['benchmark_id'], ['benchmark.id'], ),
    sa.ForeignKeyConstraint(['flavor_id'], ['flavor.id'], ),
    sa.ForeignKeyConstraint(['site_id'], ['site.id'], ),
    sa.ForeignKeyConstraint(['uploader_iss', 'uploader_sub'], ['user.iss', 'user.sub'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('result_claim',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('uploader_sub', sa.Text(), nullable=False),
    sa.Column('uploader_iss', sa.Text(), nullable=False),
    sa.Column('upload_datetime', sa.DateTime(), nullable=False),
    sa.Column('status', sa.Enum('on_review', 'approved', name='resourcestatus'), nullable=True),
    sa.Column('message', sa.Text(), nullable=False),
    sa.Column('resource_id', postgresql.UUID(as_uuid=True), nullable=True),
    sa.Column('_submit_report_id', postgresql.UUID(as_uuid=True), nullable=True),
    sa.ForeignKeyConstraint(['_submit_report_id'], ['submit.id'], ),
    sa.ForeignKeyConstraint(['resource_id'], ['result.id'], ),
    sa.ForeignKeyConstraint(['uploader_iss', 'uploader_sub'], ['user.iss', 'user.sub'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('result_tags',
    sa.Column('result_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('tag_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.ForeignKeyConstraint(['result_id'], ['result.id'], ),
    sa.ForeignKeyConstraint(['tag_id'], ['tag.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('result_id', 'tag_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('result_tags')
    op.drop_table('result_claim')
    op.drop_table('result')
    op.drop_table('flavor')
    op.drop_table('site')
    op.drop_table('benchmark')
    op.drop_table('user')
    op.drop_table('tag')
    op.drop_table('submit')
    # ### end Alembic commands ###
