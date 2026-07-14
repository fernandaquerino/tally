import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";

type ErrorBody = {
  error: {
    code: string;
    message: string;
  };
};

type HttpResponse = {
  status(statusCode: number): {
    json(body: ErrorBody): void;
  };
};

type HttpRequest = {
  method: string;
  url: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<HttpResponse>();
    const request = context.getRequest<HttpRequest>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : undefined;
    const code = this.getCode(exceptionResponse, status);
    const message = this.getMessage(exceptionResponse, status);

    if (status >= 500) {
      this.logger.error(`${request.method} ${request.url} failed with ${code}`);
    }

    response.status(status).json({ error: { code, message } });
  }

  private getCode(response: string | object | undefined, status: number): string {
    if (typeof response === "object" && response !== null && "code" in response) {
      const code = response.code;

      if (typeof code === "string") {
        return code;
      }
    }

    return typeof HttpStatus[status] === "string" ? HttpStatus[status] : `HTTP_${status}`;
  }

  private getMessage(response: string | object | undefined, status: number): string {
    if (typeof response === "string") {
      return response;
    }

    if (typeof response === "object" && response !== null && "message" in response) {
      const message = response.message;

      if (typeof message === "string") {
        return message;
      }
    }

    return status >= 500 ? "Erro interno do servidor." : "Não foi possível processar a requisição.";
  }
}

