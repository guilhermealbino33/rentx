import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe("Create Car Specification", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        specificationsRepositoryInMemory =
            new SpecificationsRepositoryInMemory();
        createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
            carsRepositoryInMemory,
            specificationsRepositoryInMemory
        );
    });
    it("Should be able to add a new specification to the car", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Name Car",
            description: "Description Car",
            daily_rate: 100,
            license_plate: "ABC-1234",
            fine_amount: 60,
            brand: "Brand",
            category_id: "category",
        });
        const specification = await specificationsRepositoryInMemory.create({
            description: "test",
            name: "test",
        });

        const specification_id = [specification.id];
        const specifications_cars = await createCarSpecificationUseCase.execute(
            {
                car_id: car.id,
                specification_id,
            }
        );
        expect(specifications_cars).toHaveProperty("specifications");
        expect(specifications_cars.specifications.length).toBe(1);
    });
    it("Should not be able to add a new specification to a non existent car", async () => {
        const car_id = "1234";
        const specification_id = ["54321"];
        await expect(
            createCarSpecificationUseCase.execute({
                car_id,
                specification_id,
            })
        ).rejects.toEqual(new AppError("Car does not exists!"));
    });
});
