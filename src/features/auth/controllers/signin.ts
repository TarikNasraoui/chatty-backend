import { Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import { loginSchema } from '@auth/schemes/signin';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { BadRequestError } from '@global/helpers/error-handler';
import HTTP_STATUS from 'http-status-codes';
import { authService } from '@service/db/auth.service';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { config } from '@root/config';
import { IUserDocument } from '@user/interfaces/user.interface';
import { userService } from '@service/db/user.service';

export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response) {
    const { username, password } = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByUsername(
      username
    );

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const matchedPassword: boolean = await existingUser.comparePassword(
      password
    );

    if (!matchedPassword) {
      throw new BadRequestError('Invalid credentials');
    }

    const user: IUserDocument = await userService.getUserByAuthId(
      `${existingUser._id}`
    );
    const userJwt = JWT.sign(
      {
        userId: user,
        uId: existingUser.uId,
        email: existingUser.email,
        username: existingUser.username,
        avatarColor: existingUser.avatarColor,
      },
      config.JWT_TOKEN!
    );

    req.session = { jwt: userJwt };
    res.status(HTTP_STATUS.OK).json({
      message: 'User login successfully',
      user: existingUser,
      token: userJwt,
    });
  }
}
