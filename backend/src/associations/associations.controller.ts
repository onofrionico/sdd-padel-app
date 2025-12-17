import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Association } from './entities/association.entity';
import { AssociationMembership } from './entities/association-membership.entity';
import { AssociationsService } from './associations.service';
import { CreateAssociationRequestDto } from './dto/create-association-request.dto';
import { UpdateAssociationRequestDto } from './dto/update-association-request.dto';
import { CreateMembershipRequestDto } from './dto/create-membership-request.dto';
import { SetMemberCategoryRequestDto } from './dto/set-member-category-request.dto';

@ApiTags('Associations')
@ApiBearerAuth()
@Controller('associations')
export class AssociationsController {
  constructor(private readonly associationsService: AssociationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new association' })
  @ApiBody({ type: CreateAssociationRequestDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: Association })
  async create(@Body() dto: CreateAssociationRequestDto): Promise<Association> {
    return this.associationsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List associations' })
  @ApiResponse({ status: HttpStatus.OK, type: [Association] })
  async findAll(): Promise<Association[]> {
    return this.associationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get association by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: HttpStatus.OK, type: Association })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Association> {
    return this.associationsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update association' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateAssociationRequestDto })
  @ApiResponse({ status: HttpStatus.OK, type: Association })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAssociationRequestDto,
  ): Promise<Association> {
    return this.associationsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete association' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Association deleted successfully' },
      },
    },
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.associationsService.remove(id);
    return { message: 'Association deleted successfully' };
  }

  @Post(':associationId/memberships')
  @ApiOperation({ summary: 'Add a user as a member of an association' })
  @ApiParam({ name: 'associationId', format: 'uuid' })
  @ApiBody({ type: CreateMembershipRequestDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: AssociationMembership })
  async addMember(
    @Param('associationId', ParseUUIDPipe) associationId: string,
    @Body() dto: CreateMembershipRequestDto,
  ): Promise<AssociationMembership> {
    return this.associationsService.addMember(associationId, dto);
  }

  @Delete(':associationId/memberships/:userId')
  @ApiOperation({ summary: 'Remove a user membership from an association' })
  @ApiParam({ name: 'associationId', format: 'uuid' })
  @ApiParam({ name: 'userId', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Membership removed successfully' },
      },
    },
  })
  async removeMember(
    @Param('associationId', ParseUUIDPipe) associationId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<{ message: string }> {
    await this.associationsService.removeMember(associationId, userId);
    return { message: 'Membership removed successfully' };
  }

  @Put(':associationId/members/:userId/category')
  @ApiOperation({ summary: 'Set member category for an association' })
  @ApiParam({ name: 'associationId', format: 'uuid' })
  @ApiParam({ name: 'userId', format: 'uuid' })
  @ApiBody({ type: SetMemberCategoryRequestDto })
  @ApiResponse({ status: HttpStatus.OK, type: AssociationMembership })
  async setMemberCategory(
    @Param('associationId', ParseUUIDPipe) associationId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: SetMemberCategoryRequestDto,
  ): Promise<AssociationMembership> {
    return this.associationsService.setMemberCategory(
      associationId,
      userId,
      dto.category,
    );
  }

  @Get(':associationId/members/:userId/category')
  @ApiOperation({ summary: 'Get member category for an association' })
  @ApiParam({ name: 'associationId', format: 'uuid' })
  @ApiParam({ name: 'userId', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        category: { type: 'number', nullable: true, example: 4 },
      },
    },
  })
  async getMemberCategory(
    @Param('associationId', ParseUUIDPipe) associationId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<{ category: number | null }> {
    return this.associationsService.getMemberCategory(associationId, userId);
  }
}
