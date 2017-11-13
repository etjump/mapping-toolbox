export enum OverbounceType {
    Fall,
    Jump
}

export enum Direction {
    Down,
    Up
}

export const defaultGravity = 800;
export const defaultPmoveMsec = 8;
export function checkOverbounce(
    height: number,
    gravity: number = defaultGravity,
    pmoveMsec: number = defaultPmoveMsec
): OverbounceType[] {
    var psec = pmoveMsec / 1000,
        v0 = 0,
        h0 = height,
        rintv = Math.round(gravity * psec),
        t = 0,
        a,
        b,
        c,
        n2,
        n,
        hn,
        overbounceTypes = [];

    // Fall OB
    a = -psec * rintv / 2;
    b = psec * (v0 - gravity * psec / 2 + rintv / 2);
    c = h0 - t;
    n2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    n = Math.floor(n2);
    hn = h0 + psec * n * (v0 - gravity * psec / 2 - (n - 1) * rintv / 2);

    if (n && hn < t + 0.25 && hn > t) {
        overbounceTypes.push(OverbounceType.Fall);
    }

    // Jump OB
    v0 += 270; // JUMP_VELOCITY
    b = psec * (v0 - gravity * psec / 2 + rintv / 2);
    // n1 = (-b + sqrt(b * b - 4 * a * c ) ) / (2 * a);
    n2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    // CG_Printf("%f, %f\n", n1, n2);
    n = Math.floor(n2);
    hn = h0 + psec * n * (v0 - gravity * psec / 2 - (n - 1) * rintv / 2);
    // CG_Printf("h0: %f, v0: %f, n: %d, hn: %f, t: %f\n", h0, v0, n, hn, t);
    if (hn < t + 0.25 && hn > t) {
        overbounceTypes.push(OverbounceType.Jump);
    }

    return overbounceTypes;
}

export function findOverbounceHeights(
    type: OverbounceType,
    target: number,
    count: number,
    direction: Direction
) {
    let heights: number[] = [];
    while (true) {
        // arbitrary target limit as we're not interested in values
        // below 0 very often (and the algorithm will loop forever once we
        // reach a certain point)
        if (heights.length >= count || target < -1000) {
            break;
        }
        const result = checkOverbounce(target);
        if (result.indexOf(type) >= 0) {
            heights.push(target);
        }
        if (direction === Direction.Up) {
            ++target;
        } else {
            --target;
        }
    }
    return heights;
}
