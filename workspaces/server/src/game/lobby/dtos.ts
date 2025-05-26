import { IsNumber, IsString } from 'class-validator';

export class LobbyJoinDto {
  @IsString()
  lobbyIdJoin: string;
}

export class CheckingOtherHandDto {
  @IsString()
  idOtherPlayer: string;
}

export class DrawOtherPlayerCardDto {
  @IsString()
  idOtherPlayer: string;

  @IsNumber()
  indexCardDraw: number;
}
