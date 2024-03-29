import { Global, Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { SeriesModule } from './series/series.module';
import { UsersModule } from './users/users.module';
import StorageService from './services/storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Global()
@Module({
  imports: [ArticlesModule, SeriesModule, UsersModule],
  providers: [StorageService],
  exports: [StorageService],
})
export class SiteAdminModule {}
