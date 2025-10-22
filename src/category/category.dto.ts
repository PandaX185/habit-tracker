import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponse {
    @ApiProperty({
        description: 'Unique identifier of the category',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string

    @ApiProperty({
        description: 'Name of the category',
        example: 'Health'
    })
    name: string

    @ApiProperty({
        description: 'Icon of the category',
        example: 'health'
    })
    icon: string
}