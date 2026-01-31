import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './services/payments.service';
import { RefundsService } from './services/refunds.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateRefundDto } from './dto/create-refund.dto';
import { Payment } from './entities/payment.entity';
import { Refund } from './entities/refund.entity';
import { User } from '../users/entities/user.entity';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly refundsService: RefundsService,
  ) {}

  @Post('enrollments/:enrollmentId')
  @ApiOperation({ summary: 'Create payment for enrollment' })
  @ApiParam({ name: 'enrollmentId', format: 'uuid' })
  @ApiResponse({ status: 201, type: Payment })
  async createPayment(
    @Req() req: { user: User },
    @Param('enrollmentId', ParseUUIDPipe) enrollmentId: string,
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    return this.paymentsService.createPaymentForEnrollment(
      enrollmentId,
      req.user.id,
      createPaymentDto.paymentType,
    );
  }

  @Get(':paymentId')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiParam({ name: 'paymentId', format: 'uuid' })
  @ApiResponse({ status: 200, type: Payment })
  async getPayment(
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
  ): Promise<Payment> {
    return this.paymentsService.getPaymentById(paymentId);
  }

  @Get('enrollments/:enrollmentId')
  @ApiOperation({ summary: 'Get payment by enrollment ID' })
  @ApiParam({ name: 'enrollmentId', format: 'uuid' })
  @ApiResponse({ status: 200, type: Payment })
  async getPaymentByEnrollment(
    @Param('enrollmentId', ParseUUIDPipe) enrollmentId: string,
  ): Promise<Payment | null> {
    return this.paymentsService.getPaymentByEnrollment(enrollmentId);
  }

  @Post(':paymentId/refund')
  @ApiOperation({ summary: 'Initiate refund for payment' })
  @ApiParam({ name: 'paymentId', format: 'uuid' })
  @ApiResponse({ status: 201, type: Refund })
  async initiateRefund(
    @Req() req: { user: User },
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
    @Body() createRefundDto: CreateRefundDto,
  ): Promise<Refund> {
    return this.refundsService.initiateRefund(
      paymentId,
      createRefundDto.amount,
      createRefundDto.reason || 'Refund requested',
      req.user.id,
    );
  }

  @Post('refunds/:refundId/process')
  @ApiOperation({ summary: 'Process pending refund' })
  @ApiParam({ name: 'refundId', format: 'uuid' })
  @ApiResponse({ status: 200, type: Refund })
  async processRefund(
    @Param('refundId', ParseUUIDPipe) refundId: string,
  ): Promise<Refund> {
    return this.refundsService.processRefund(refundId);
  }

  @Get(':paymentId/refunds')
  @ApiOperation({ summary: 'Get refunds for payment' })
  @ApiParam({ name: 'paymentId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [Refund] })
  async getRefunds(
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
  ): Promise<Refund[]> {
    return this.refundsService.getRefundsByPayment(paymentId);
  }

  @Post('webhooks/:gateway')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Payment gateway webhook endpoint' })
  @ApiParam({ name: 'gateway', description: 'Payment gateway name (e.g., mercadopago)' })
  @ApiResponse({ status: 200 })
  async handleWebhook(
    @Param('gateway') gateway: string,
    @Body() webhookData: any,
  ): Promise<{ success: boolean }> {
    await this.paymentsService.processPaymentWebhook(webhookData);
    return { success: true };
  }
}
