import React from "react";
import "../icons.css";

export const BankPichincha = (props) => {
  return (
    <img
      width={props.size}
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADVCAMAAAAsJe+TAAADAFBMVEUAAAD/9cT36FT/9cH/9rr/
  +rP/9dD/9tL26Wz+8Ij+9qj89K/99cD99cb46Wf77nf/+8z/883++dr67F3/8H348H7+64D/8JP/
  8pj/8J7/8KP/873/8tj/+tz+5mr/63H69Y3/9r7//cD/+df93RgaLVX43hf/3CD63xL/3BD53Bz6
  3RX53hv/3RX+3Rb/3RT73Rn72hn34Bby4Bz93Bv74BP73xb/2BMhJ1n92xq7tCb84g8XMVYaLlP8
  3BX93RMYMEz73xz23xcXMk/74BUdKVsbLVFTWU324Rj/3BQaL0744hkeLVYeLFMVMVYSM1IcLlIV
  L1BXV0vDtSEfK1sdKVkeKlQUM1D93hH/3hj53Bb+3SP03B/23xz/3Br/3xT/3xD72B7/3hr/2xn6
  3Rf/2hb/2xL53w/53Cb/2iX04iH/2CD/3h7/2Bf72hX+4hT93Q/22ST+4CP94Bn14BH93wv63wr+
  4wj/3QMbKEleVkj66Uf54jf+3TLy4Sb64CH63SH62yD42xv93hT23BP52w/+2Q/74Azv3gr23AUg
  KGAYMFkRLFckLlMjMkT15Ti7szD/1Sr/5Cj54h/73R793B354xf/4hH62Q7/3g323Qz/2gvz3wj5
  3QAXL2QTNWAZKF8aKVMjKFL96U8QMkwpJEn040H/4C723ir+2in+3Sfn4yX82iD/4B3/2x324xv+
  4hv/1Rvt3xr15Bb03hbw3hT74hP25AAaKWwiNGccKmYoLGMSLlwRNVkYN1IUKlEgM04lKE4fL0n0
  50dVV0QOLkQgKUT43EAsJT795D23vDwiKjcQLzX55DK0sy335Cr+7CD32h/94h773Rvv5RX71hX/
  1BX73hT53RL/2w/35Qr63Ar/6QUOHHVZYl9iV1NOWk45Lk5UWEpPV0oLKkbazkTEr0Kto0FUXUAS
  Mj9sYDj03TX24DTm1zL31DK/pjA4Oizw7Cjs1ijx4CD40R6uuR3BuB3n0Rvo6Bj12Bi9uRjT1hX6
  6xT40A/v1Q7m3g079TuJAAAAJHRSTlMAMvg2Q1AdF9CdZVg5Lti7JSAL6LCuq4qAd209DgfUxpM9
  OQ75r+SEAAAFuElEQVR42u3bdVPUQRjA8VUJu7tjFTDuQE8xD1sBO6/vuKRBGqSRsjvB7u7u7u7u
  7u4Y/9E552ZuD8Tnh8/nHXxnd2d2d+YhCCGEEEIIIYQQ+k/ZEPCKE3MVywtc/qpFiZmsV9YDLj1l
  bCVinoLr7IELv+BbhJjHSlkHuFVO80sQ8+TzsgPudEgjs1fG0wG48arxNYh5rMfUBc5nhV1hc7dZ
  QwpcnQb182AMRBgDFcZAhTFQYQxUGAMVxkCFMdlFFiaU+iqUegEjkDFxgz4k2DkGL2nCCGTMBLrc
  kReYJGnGCGRMxOvRdQXKIFkLRiBjJj8beXRk75FHmzMCGXPvxqHhww7t3dmUEciYgztub1kfOXVa
  S0YgY5rPaT1tfeTGoa0YgYzp3a9bH7ceffvXZoQxGIMxGIMxGIMxGIMxGIMxGPOvY0Zumnp40/TI
  HV2NbJ8e2XTw8C4bORXzpuu0w5uHznbrbmTP5q1Duj3Y1p1TMR/nbNg+eEi7GbWN9Jg+ZGiXYU2H
  cyrm7f7BMwe7uXXtYmRYlyHbhs1supdTMQeHD3WbsWf21p5GIntumd16xoapnIq5G3Uz6truW7t7
  GYnqdf1+VNTVK5yKufzuW8aS1a8y3I0IvVdeXDL503NOxZyN+Zyp85NGuBpxDhoUsSJ80RxOxZjS
  xrm9sK2LoCPGYMwvGIMxGIMxGIMxGIMxGIMxGIMxGIMxGIMxGBMX7ilZGvF+ZzsTOBUzIHW0/dlJ
  i2Z2MIFbMcnS1BT1k/2tTeBUzGilnUGoefmwkwmcijE4eMgd+cfvdDaBUzHhAT5j3FNCjzubwKmY
  MMWKtu6+X9I5NdhgyiCpIiRt3igVp0ZOfsP9YSCMwRiMYYIxGIMxbDAGYzCGDcZgDMawwRiMwRg2
  GIMxfyoeQIFjiCmxlgLHEGObm7ZZZRkFjiGGzKfAscREU+BYYgZS4P7XmCqFwuz8AkPkAh8KFMvK
  FDYo/AIbyk/5UaBYYkrKk/W8OvK6OgoUSwwZMXmSQitP5FOgmGKKrgldqpWfUFGgmGIqxIbanXc/
  MYECxRRjOyLVJ3n8ALC3Z6YYMtfe59La3BJTQK5QPg2nULHFFDriok4ISKJAscWQvGGLQ6X2FCjG
  mHKrBoSO1VKgGGNsRgwQ2SdSoBhjSNn5NAzsi5M1xuaA8pw7BYo1hswKjx9PgWKOqfnia0z9uJB1
  LTw9wF1rmGNIMZnDqYWJkwMWJuSCmMoD01y9Fnj4Bo01UGDYY0iB0xE8Lx8FlQyiwFgQY5s//RJf
  owusJ6fAWBBD8jxeHcbXuQSPocBYEkMKzM0QLdUEt6HAWBRjU3TNOS+fXHFmfrAe6KEPqJPmIhTY
  +YpFoRQIy2JIxWj/wFRPEU89TkCTRBQIC2NI+WPpfgtESrHAyYmKKRCWxpDS3mc0yUk86uQk8KVA
  WBxDyp6c6C8Ui6lgnB0FwvIYUrrR4nFUzBOrBRSILMSQMvMWjhMmKXlCCkRWYsiBeYv9k0UiFwpE
  lmJImVUpo7y0q33FolSV2GsUZQMshhSMztRLA9PrBQWNPW/45x/qWYwhhQYaprjGxBsM9eMbXqRs
  wMWQKvnjUmKkVOQi8PSkbODFEFJuRKYwZoE+Qsf1M/OT9axoycQprq6BlA3IGEIq7GqrlZ5sTNkA
  jSG1CkSnrTlG2UCNIaR49V0rHbXa4OBgR4lOo9E5O+sUoh9UKj7fKYdoLqwtTLKHVUVvb+/6aoWf
  n1q9fHn7hiEh8fEJCR4/NM4hUs2YIiTbWOWPzcjUe02c6C+pK5PJJBKJVsjj8RxzSOIZWRGSnQpV
  O5I2OqiZv7PDpElqsVjs6uqg5+WQy6q4wiR72eYplXfuI89m+imJ/v5CPl+l5OeQdVPaWJPsV9Kq
  fLFSs2JjY729ly1b1iiHLNq3rxL5m0ra2pTIk0MKWhUkCCGEEEIIIYQQQgghxHXfAbMoMIHKlAM6
  AAAAAElFTkSuQmCC"
      alt=""
    />
  );
};

export default BankPichincha;
