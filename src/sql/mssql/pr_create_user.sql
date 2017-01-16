CREATE PROCEDURE [dbo].[pr_create_user] (
	@email VARCHAR(128),
	@bcrypt_password CHAR(60),
	@user_id INT OUT
) AS
BEGIN
	INSERT INTO [dbo].[users] (
		[email],
		[bcrypt_password]
	) VALUES (
		@email,
		@bcrypt_password
	)

	SET @user_id = @@IDENTITY
END