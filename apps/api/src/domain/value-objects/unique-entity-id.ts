import { v4 as uuid } from 'uuid';

/**
 * Value Object to represent unique entity identifiers
 */
export class UniqueEntityID {
  private readonly value: string;

  private constructor(id: string) {
    this.value = id;
  }

  /**
   * Creates a new unique identifier
   * @param id Optional existing ID, generates new UUID if not provided
   */
  public static create(id?: string): UniqueEntityID {
    return new UniqueEntityID(id || uuid());
  }

  /**
   * Gets the string representation of the ID
   */
  public toString(): string {
    return this.value;
  }

  /**
   * Checks equality with another UniqueEntityID
   */
  public equals(other: UniqueEntityID): boolean {
    return this.value === other.value;
  }
}
