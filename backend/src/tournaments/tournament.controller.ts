import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
  Query,
  BadRequestException,
  HttpStatus,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { TournamentService, CreateTournamentDto, UpdateTournamentDto } from './tournament.service';
import { Tournament, TournamentStatus, TournamentType } from './entities/tournament.entity';
import { CreateTournamentRequestDto } from './dto/create-tournament-request.dto';
import { UpdateTournamentRequestDto } from './dto/update-tournament-request.dto';
import { ApiProperty } from '@nestjs/swagger';

// Response DTOs for Swagger documentation
class TournamentResponseDto extends Tournament {}
class TournamentListResponseDto {
  @ApiProperty({ type: [Tournament], description: 'Array of tournament items' })
  items: Tournament[];
  
  @ApiProperty({ description: 'Total number of items across all pages' })
  count: number;
  
  @ApiProperty({ description: 'Current page number (1-based)' })
  page: number;
  
  @ApiProperty({ description: 'Number of items per page' })
  pageSize: number;
}

@ApiTags('Tournaments')
@ApiBearerAuth()
@Controller('tournaments')
@ApiExtraModels(Tournament, TournamentResponseDto, TournamentListResponseDto)
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new tournament',
    description: 'Creates a new tournament with the provided details.'
  })
  @ApiBody({
    type: CreateTournamentRequestDto,
    description: 'Tournament creation data',
    examples: {
      basic: {
        summary: 'Basic tournament',
        value: {
          name: 'Summer Padel Open',
          description: 'Annual summer padel tournament',
          startDate: '2024-07-15T10:00:00.000Z',
          type: 'single_elimination',
          settings: {
            maxTeams: 16,
            minTeams: 8,
            teamSize: 2,
            pointsDistribution: {
              winner: 100,
              finalist: 70,
              semiFinalist: 50,
            },
          },
          associationId: '550e8400-e29b-41d4-a716-446655440000',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The tournament has been successfully created.',
    type: TournamentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Association not found',
  })
  async create(
    @Body() createTournamentDto: CreateTournamentDto,
  ): Promise<TournamentResponseDto> {
    return this.tournamentService.create(createTournamentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all tournaments',
    description: 'Retrieves a list of tournaments with optional pagination and filtering.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by tournament status',
    enum: Object.values(TournamentStatus),
    example: 'upcoming',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of tournaments',
    type: TournamentListResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid pagination parameters',
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('status') status?: TournamentStatus,
  ): Promise<TournamentListResponseDto> {
    if (page < 1) {
      throw new BadRequestException('Page must be greater than 0');
    }
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const [items, totalCount] = await this.tournamentService.findAll({
      skip: (page - 1) * limit,
      take: limit,
      where: status ? { status } : {},
    });

    return {
      items,
      count: totalCount,
      page,
      pageSize: limit,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a tournament by ID',
    description: 'Retrieves detailed information about a specific tournament.',
  })
  @ApiParam({
    name: 'id',
    description: 'Tournament ID',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The tournament was found',
    type: TournamentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tournament not found',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TournamentResponseDto> {
    return this.tournamentService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a tournament',
    description: 'Updates an existing tournament with the provided data.',
  })
  @ApiParam({
    name: 'id',
    description: 'Tournament ID',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateTournamentRequestDto,
    description: 'Tournament update data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The tournament was updated successfully',
    type: TournamentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tournament or Association not found',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ): Promise<TournamentResponseDto> {
    return this.tournamentService.update(id, updateTournamentDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a tournament',
    description: 'Deletes a tournament and all its related data.',
  })
  @ApiParam({
    name: 'id',
    description: 'Tournament ID',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The tournament was deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Tournament deleted successfully' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tournament not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not authorized to delete this tournament',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.tournamentService.remove(id);
    return { message: 'Tournament deleted successfully' };
  }

  @Put(':id/status')
  @ApiOperation({
    summary: 'Update tournament status',
    description: 'Updates the status of a tournament (e.g., from "upcoming" to "in_progress").',
  })
  @ApiParam({
    name: 'id',
    description: 'Tournament ID',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'status',
    required: true,
    description: 'New status for the tournament',
    enum: Object.values(TournamentStatus),
    example: 'in_progress',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tournament status was updated successfully',
    type: TournamentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid status transition',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tournament not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Status transition not allowed',
  })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('status') status: TournamentStatus,
  ): Promise<TournamentResponseDto> {
    if (!Object.values(TournamentStatus).includes(status)) {
      throw new BadRequestException('Invalid status value');
    }
    return this.tournamentService.updateStatus(id, status);
  }
}
