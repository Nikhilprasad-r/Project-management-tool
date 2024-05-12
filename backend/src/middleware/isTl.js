const isTl = (req, res, next) => {
  if (req.user && req.user.role === "tl") {
    next();
  } else if (req.user && req.user.isAdmin) {
    next();
  } else {
    res
      .status(403)
      .json({ msg: "Access denied. Team leaders only have access" });
  }
};
export default isTl;
