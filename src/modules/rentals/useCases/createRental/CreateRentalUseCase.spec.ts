import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;

describe("Create Rental", () => {
    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory
        );
    });
    it("Should be able to create a new rental", async () => {
        const rental = await createRentalUseCase.execute({
            car_id: "121212",
            user_id: "12345",
            expected_return_date: new Date(),
        });
        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });
    it("Should not be able to create a new rental if there is another open to the same user", async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                car_id: "121212",
                user_id: "12345",
                expected_return_date: new Date(),
            });
            await createRentalUseCase.execute({
                car_id: "121213",
                user_id: "12345",
                expected_return_date: new Date(),
            });
        }).rejects.toBeInstanceOf(AppError);
    });
    it("Should not be able to create a new rental if there is another open to the same car", async () => {
        expect(async () => {
            await createRentalUseCase.execute({
                car_id: "121212",
                user_id: "12345",
                expected_return_date: new Date(),
            });
            await createRentalUseCase.execute({
                car_id: "121212",
                user_id: "AAA",
                expected_return_date: new Date(),
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});