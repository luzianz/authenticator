CREATE TABLE [users] (
	[id]              INT          NOT NULL IDENTITY,
	[email]           VARCHAR(128) NOT NULL,
	[bcrypt_password] CHAR(60)     NOT NULL,
	[when_created]    DATETIME     NOT NULL,

	CONSTRAINT [pk_users] PRIMARY KEY CLUSTERED ([id] ASC)
)
GO

ALTER TABLE [dbo].[users]
ADD CONSTRAINT [df_users_when_created]
DEFAULT (getdate())
FOR [when_created]
GO

CREATE UNIQUE NONCLUSTERED INDEX [ix_users_email]
ON [dbo].[users] ([email] ASC)
GO