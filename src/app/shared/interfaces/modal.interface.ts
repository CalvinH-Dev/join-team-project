export interface ModalConfig {
  id: string;
  title?: string;
  content?: string;
  size: 'small' | 'medium' | 'large' | 'fullscreen';
  closable: boolean;
  backdropClose: boolean;
  escapeClose: boolean;
  showHeader: boolean;
  showFooter: boolean;
  customClass?: string;
}

export interface ModalRef<T = any> {
  componentInstance: T;
  config: ModalConfig;
  close(result?: any): void;
  result: Promise<any>;
}