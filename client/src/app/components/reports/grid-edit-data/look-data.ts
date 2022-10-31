import { DataServerService } from '../../../shared/services/data-server.service';

export class LookData {
  private lookData: any[] = [];

  constructor(private dataService: DataServerService) {}
}
