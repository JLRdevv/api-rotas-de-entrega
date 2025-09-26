import { ApiPropertyOptional } from '@nestjs/swagger';

export class DateQueryDto {
  @ApiPropertyOptional({
    description:
      'One or two dates in dd-mm-yyyy format. One date = exact filter, two dates = date range.',
    type: String,
    isArray: true,
    example: ['01-01-2025', '31-01-2025'],
  })
  date?: string[];
}
