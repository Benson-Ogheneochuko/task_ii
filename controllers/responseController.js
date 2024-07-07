export const responseController = (req, res) => {
  res.status(201).json({
    status: "success",
    message: "Registration successful",
    data: {
      accessToken: res.locals.accessToken,
      user: res.locals.user,
    },
  });
};