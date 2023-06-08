import * as jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from './prisma';

export const privateRsaKey = `-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----
`;

export const publicRsaKey = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAvGiFpe2uz8XMbYkqL8IW
rkNcmeyBAWXdN05XfFl10+apEWIHMD96T2FyAOWYWQcUvB2UhDnJAh026HG6HcmR
sg+FzdkNDPlEXd/FJBJWfIL0cTT1fy1FTUPWfaEwU658QQY3RXCxbToxZQNtuace
xrEHMl7lDSe2D9ifQjmrzVOIxAT02BcTyK+zyQIkyceUOoSMs02LU4CFGp7y340m
GEWCU9gzj2PeZy8gI4fiBoaxGdxrDE5txS8MDokmhmhJMnMk3D67g+gBeWe2QtdC
q0wyORmrCf0RYbVsFcXq2+MLKXOw6WH5NmwVPGTBvLE/oD9SXJitTBg+cIgPd9D3
I9TvAbazGWWZXzup7ElFU57rmI6y8dGPI+K60/k2ceahesYsowdgfOTkyLLgV1M7
6dV4Hk2Z/5ZFPXLcUsS2HaAhOAlt8ybutrasHJloNysJ3SPEdWOOYtsRA5mVBZ4l
6WtufQ6BVmmTFkEO0S6oidUGkvbKtoWpz/WlxkgYA3S1Dl6AdYYZHA9QTFwFVrQt
cKQyt/UjuY7bQ3ZqNlTYV3+oVXC8JhqEWYoaS/W+LR1I/Sewy1eH18ybHN3F3jow
1ns7eVM6e+S8sD66zGetgReBT0HUoUqEOjkBhfFzgepdnXg0Nk/W3e1C1OoGizc0
2lVNdCrOAyU96Y+HunErZ88CAwEAAQ==
-----END PUBLIC KEY-----
`;

/**
 * Todos:
 * - if the cookie is expired, log out the user
 * - move the RSA keys to env variables
 */
export const getCurrentUser = async () => {
  const cx = cookies();

  const token = cx.get('token');

  const validToken = jwt.verify(token, privateRsaKey, {
    algorithms: ['RS256'],
  });

  if (typeof validToken === 'object' && validToken.email) {
    const { email } = validToken;

    return await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });
  }
  throw new Error('Unable to authenticate.');
};

export const getCurrentCoach = async () => {
  const cx = cookies();

  const token = cx.get('token');

  if (!token) throw new Error('Unable to authenticate.');
  const validToken = jwt.verify(token, privateRsaKey, {
    algorithms: ['RS256'],
  });

  if (typeof validToken === 'object' && validToken.email) {
    const { email } = validToken;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    const coach = await prisma.coach.findFirstOrThrow({
      where: {
        userId: user.id,
      },
    });

    return { ...coach, user };
  }
  throw new Error('Unable to authenticate.');
};
