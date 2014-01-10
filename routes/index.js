/*
 * GET home page.
 */
exports.home = function(req, res){
  res.send(["Welcome to InMind.",
            "<br>",
            "Secure?",
            req.secure,
            "<br>",
            "You are connecting to:",
            req.get('Host')].join(' '));
};
