import Base64 from 'crypto-js/enc-base64';
import sha256 from 'crypto-js/sha256';

const hash = (msg: string) => {
    // TODO: only for debug
    return msg;
    // return Base64.stringify(sha256(msg));
};

export {
    hash
};
