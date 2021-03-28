function print(x)
{
    console.log(x);
}

function map(val, lb, ub, lv, uv)
{
    return lv + (val-lb)*(uv-lv)/(ub-lb);
}
