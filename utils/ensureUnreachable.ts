function ensureUnreachable(_something: never) {
    throw 'Unreachable code!';
}

export default ensureUnreachable;
