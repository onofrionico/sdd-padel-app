"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTournamentRequestDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_tournament_request_dto_1 = require("./create-tournament-request.dto");
class UpdateTournamentRequestDto extends (0, mapped_types_1.PartialType)(create_tournament_request_dto_1.CreateTournamentRequestDto) {
}
exports.UpdateTournamentRequestDto = UpdateTournamentRequestDto;
//# sourceMappingURL=update-tournament-request.dto.js.map