
export { maskedEval };

/**
 * A semi-working way of stopping users from accessing global score, although if
 * they really wanted to they still could. This is just to block accidental
 * cheating. Execute the given code with the given context
 * @param code The javascript code to execute
 * @param ctx The context with values of variables
 * @note See also this post on SO:
 * https://stackoverflow.com/questions/543533/restricting-eval-to-a-narrow-scope
 */
function maskedEval(this: any, code: string, ctx: Record<string, any>) {
    let mask: Record<string, any> = {
        window: undefined,
        document: undefined,
        ...ctx,
    };
    for (let p in this)
        mask[p] = undefined;
    (new Function("with (this) { " + code + "}")).call(mask);
}