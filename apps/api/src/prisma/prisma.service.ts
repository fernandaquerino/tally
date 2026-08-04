import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient, PrismaPg } from "@tally/db";

/**
 * Única instância do PrismaClient da API (AGENTS §14). Repositories injetam este
 * service; ninguém mais instancia Prisma. Usa o driver adapter `pg` com a
 * `DATABASE_URL` validada na config.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(config: ConfigService) {
    const connectionString = config.getOrThrow<string>("DATABASE_URL");

    super({ adapter: new PrismaPg({ connectionString }) });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log("Prisma conectado ao PostgreSQL.");
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
