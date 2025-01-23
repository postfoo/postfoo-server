// Taken from https://github.com/sergiodxa/remix-utils/blob/main/src/server/honeypot.ts


import { decrypt, encrypt, randomString } from 'src/utils/crypto'
import * as errors from 'src/utils/errors'

export interface HoneypotInputProps {
  /**
	 * The name expected to be used by the honeypot input field.
	 */
  nameFieldName: string,
  /**
	 * The name expected to be used by the honeypot valid from input field.
	 */
  validFromFieldName: string | null,
  /**
	 * The encrypted value of the current timestamp.
	 */
  encryptedValidFrom: string,
}

export interface HoneypotConfig {
  /**
	 * Enable randomization of the name field name, this way the honeypot field
	 * name will be different for each request.
	 */
  randomizeNameFieldName?: boolean,
  /**
	 * The name of the field that will be used for the honeypot input.
	 */
  nameFieldName?: string,
  /**
	 * The name of the field that will be used for the honeypot valid from input.
	 */
  validFromFieldName?: string | null,
  /**
	 * The seed used for the encryption of the valid from timestamp.
	 */
  encryptionSeed?: string,
}

const DEFAULT_NAME_FIELD_NAME = 'name__confirm'
const DEFAULT_VALID_FROM_FIELD_NAME = 'from__confirm'

/**
 * Module used to implement a Honeypot.
 * A Honeypot is a visually hidden input that is used to detect spam bots. This
 * field is expected to be left empty by users because they don't see it, but
 * bots will fill it falling in the honeypot trap.
 */
export class Honeypot {
  private generatedEncryptionSeed = this.randomValue()

  protected config: HoneypotConfig

  constructor(config: HoneypotConfig = {}) {
    this.config = config
  }

  /**
	 * Get the HoneypotInputProps to be used in your forms.
	 * @param options The options for the input props.
	 * @param options.validFromTimestamp Since when the timestamp is valid.
	 * @returns The props to be used in the form.
	 */
  public async getInputProps({ validFromTimestamp = Date.now() } = {}): Promise<HoneypotInputProps> {
    return {
      nameFieldName: this.nameFieldName,
      validFromFieldName: this.validFromFieldName,
      encryptedValidFrom: await this.encrypt(validFromTimestamp.toString()),
    }
  }

  public async check(formData: Record<string, string>) {
    let nameFieldName = this.config.nameFieldName ?? DEFAULT_NAME_FIELD_NAME
    if (this.config.randomizeNameFieldName) {
      const actualName = this.getRandomizedNameFieldName(nameFieldName, formData)
      if (actualName) {
        nameFieldName = actualName
      }
    }

    if (!this.shouldCheckHoneypot(formData, nameFieldName)) {
      return
    }

    if (!(nameFieldName in formData)) {
      throw errors.unauthenticated('Missing honeypot input')
    }

    const honeypotValue = formData[(nameFieldName)]

    if (honeypotValue !== '') {
      throw errors.unauthenticated('Honeypot input not empty')
    }
    if (!this.validFromFieldName) {
      return
    }

    const validFrom = formData[(this.validFromFieldName)]

    if (!validFrom) {
      throw errors.unauthenticated('Missing honeypot valid from input')
    }

    const time = await this.decrypt(validFrom as string)
    if (!time) {
      throw errors.unauthenticated('Invalid honeypot valid from input')
    }
    if (!this.isValidTimeStamp(Number(time))) {
      throw errors.unauthenticated('Invalid honeypot valid from input')
    }

    if (this.isFuture(Number(time))) {
      throw errors.unauthenticated('Honeypot valid from is in future')
    }
  }

  protected get nameFieldName() {
    const fieldName = this.config.nameFieldName ?? DEFAULT_NAME_FIELD_NAME
    if (!this.config.randomizeNameFieldName) {
      return fieldName
    }
    return `${fieldName}_${this.randomValue()}`
  }

  protected get validFromFieldName() {
    if (this.config.validFromFieldName === undefined) {
      return DEFAULT_VALID_FROM_FIELD_NAME
    }
    return this.config.validFromFieldName
  }

  protected get encryptionSeed() {
    return this.config.encryptionSeed ?? this.generatedEncryptionSeed
  }

  protected getRandomizedNameFieldName(nameFieldName: string, formData: Record<string, string>): string | undefined {
    for (const key of Object.keys(formData)) {
      if (!key.startsWith(nameFieldName)) {
        continue
      }
      return key
    }
  }

  protected shouldCheckHoneypot(formData: Record<string, string>, nameFieldName: string): boolean {
    return (
      nameFieldName in formData || Boolean(this.validFromFieldName && this.validFromFieldName in formData)
    )
  }

  protected randomValue() {
    return randomString()
  }

  protected encrypt(value: string) {
    return encrypt(value, this.encryptionSeed)
  }

  protected decrypt(value: string) {
    return decrypt(value, this.encryptionSeed)
  }

  protected isFuture(timestamp: number) {
    return timestamp > Date.now()
  }

  protected isValidTimeStamp(timestampp: number) {
    if (Number.isNaN(timestampp)) {
      return false
    }
    if (timestampp <= 0) {
      return false
    }
    if (timestampp >= Number.MAX_SAFE_INTEGER) {
      return false
    }
    return true
  }
}

// Create a new Honeypot instance, the values here are the defaults, you can
// customize them
export const honeypot = new Honeypot({
  randomizeNameFieldName: false,
  nameFieldName: 'name__confirm',
  validFromFieldName: 'from__confirm', // null to disable it
  encryptionSeed: undefined, // Ideally it should be unique even between processes
})

