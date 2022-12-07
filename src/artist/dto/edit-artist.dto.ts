import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class EdotArtistDto {
  @IsString()
  @IsOptional()
  name?: string;
}
