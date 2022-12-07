import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsNumber()
  artist_id: number;
  @IsString()
  @IsNotEmpty()
  genre: string;
}
