import { IsOptional, IsNumber, IsString } from "class-validator";

export class EditAlbumDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsOptional()
  @IsNumber()
  artist_id: number;
  @IsString()
  @IsOptional()
  genre: string;
}
