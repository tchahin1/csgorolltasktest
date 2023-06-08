import { User } from '@ankora/models';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../decorators/currentUser.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password.dto';
import { UserSignupDto } from './dto/signup.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'User signup' })
  async userSignup(@Body() body: UserSignupDto): Promise<string> {
    const { firebaseToken, email } = body;
    const token = await this.authService.generateToken(firebaseToken, email);
    await this.authService.createUser(body);
    return token;
  }

  @Post('/login')
  @ApiOperation({ summary: 'User signup' })
  async userLogin(@Body() body: UserLoginDto): Promise<string> {
    const { firebaseToken } = body;
    return this.authService.verifyTokenAndUser(firebaseToken);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  async getMe(@CurrentUser() currentUser: User): Promise<User> {
    return currentUser;
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordDto): Promise<{
    success: boolean;
  }> {
    return this.authService.sendResetPasswordEmail(
      data.email,
      data.generateMobileUrl,
    );
  }

  @Post('/reset-password')
  async resetPassword(
    @Body() resetPassword: ResetPasswordDto,
  ): Promise<string> {
    return this.authService.resetPassword(
      resetPassword.password,
      resetPassword.token,
      resetPassword.confirmPassword,
    );
  }
}
