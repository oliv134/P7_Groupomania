const CryptoJS = require("crypto-js");
const hideEmail = (email) => {
  const regex = new RegExp(
    "/(?<=.)[^@](?=[^@]*?@)|(?:(?<=@.)|(?!^)\\G(?=[^@]*$)).(?=.*[^@]\\.)"
  );
  return email.replace(regex, email);
};
const email = "username@domain.tld";
const partialEmail = email.replace(
  "(?<=.)[^@](?=[^@]*?[^@]@)|(?:(?<=@.)|(?!^)\\G(?=[^@]*$)).(?=.*[^@]\\.)",
  "*"
);
