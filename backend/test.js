const CryptoJS = require("crypto-js");
const hideEmail = (email) => {
  const regex = new RegExp ("/(?<=.)[^@](?=[^@]*?@)|(?:(?<=@.)|(?!^)\\G(?=[^@]*$)).(?=.*[^@]\\.)");
    return  email.replace(regex, email)}


console.log(hideEmail('jhondoe@gmail.com'))

console.log(CryptoJS.HmacSHA512("oliv134@oliv134.net", 'RANDOM_SECRET_EMAIL').toString());

const email = "username@domain.tld"
const partialEmail = email.replace("(?<=.)[^@](?=[^@]*?[^@]@)|(?:(?<=@.)|(?!^)\\G(?=[^@]*$)).(?=.*[^@]\\.)", "*")
console.log(partialEmail)