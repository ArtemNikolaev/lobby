module.exports = (methodArn, payload, effect) => {
  return {
    principalId: payload?.id || "*",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect || "Deny",
          Resource: methodArn,
        },
      ],
    },
    context: { role: payload?.role || "*" },
  };
};
