import { faker } from "@faker-js/faker";
import type { User } from "../types/user";

class ApiClient {
  private generateMockUser(): User {
    return {
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      city: faker.location.city(),
      registeredDate: faker.date
        .between({
          from: new Date("2020-01-01"),
          to: new Date(),
        })
        .toISOString(),
    };
  }

  async getUsers(
    page = 1,
    pageSize = 100
  ): Promise<{ users: User[]; totalCount: number; hasMore: boolean }> {
    return await new Promise((resolve) =>
      setTimeout(() => {
        const totalCount = 2500;
        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalCount);

        const users: User[] = [];
        for (let i = startIndex; i < endIndex; i++) {
          faker.seed(i + 1000);
          users.push(this.generateMockUser());
        }
        resolve({
          users,
          totalCount,
          hasMore: endIndex < totalCount,
        });
      }, 2000)
    );
  }
}

export const apiClient = new ApiClient();
