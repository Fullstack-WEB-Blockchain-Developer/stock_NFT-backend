import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class TransformPipe implements PipeTransform {
  private isObj(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  private trim(values) {
    Object.keys(values).forEach((key) => {
      if (this.isObj(values[key])) {
        values[key] = this.trim(values[key]);
      } else {
        if (typeof values[key] === 'string') {
          values[key] = values[key].trim();
        }
      }
    });
    return values;
  }

  transform(values: any, metadata: ArgumentMetadata) {
    const { type } = metadata;

    if (this.isObj(values) && type === 'body') {
      return this.trim(values);
    }

    if (type === 'param' && typeof values === 'string') {
      return values.trim();
    }

    // throw new BadRequestException('Validation failed');
  }
}
