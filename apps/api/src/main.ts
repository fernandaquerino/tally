import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter.js";
import { ResponseEnvelopeInterceptor } from "./common/interceptors/response-envelope.interceptor.js";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const allowedOrigins = config
    .get<string>("CORS_ORIGIN", "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim());

  app.enableCors({
    credentials: true,
    origin: allowedOrigins,
  });
  app.setGlobalPrefix("v1");
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseEnvelopeInterceptor());

  await app.listen(config.get<string>("API_PORT", "3001"));
}

void bootstrap();
