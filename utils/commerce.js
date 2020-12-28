import Commerce from '@chec/commerce.js';
import Cookies from 'js-cookie';
let commerce = null;
function getCommerce(commercePublicKey) {
  if (commerce) {
    console.log('use commerce');
    return commerce;
  } else {
    const checPublicKey = commercePublicKey || process.env.COMMERCE_PUBLIC_KEY;
    const devEnvironment = process.env.NODE_ENV === 'development';

    if (devEnvironment && !checPublicKey) {
      throw Error(
        'A Chec public API key must be provided as an environment variable named NEXT_PUBLIC_CHEC_PUBLIC_KEY. Retrieve your Chec public key in your Chec Dashboard account by navigating to Setup > Developer, or can be obtained with the Chec CLI via with the command chec whoami'
      );
    }
    commerce = new Commerce(checPublicKey, devEnvironment);
    console.log('new commerce');
    return commerce;
  }
}
export default getCommerce;
