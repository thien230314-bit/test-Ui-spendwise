import { useI18n } from '../i18n/I18nContext';
import labels from './labels.json';
import messages from './messages.json';
const dictionary: Record<string, string[]> = { ...messages, ...labels };
const terminology: [string,string][] = [['Frontend Simulation','mô phỏng trên trình duyệt'],['SpendId','mã người dùng'],['Membership','Kỳ thành viên'],['Fixed Fund','Quỹ cố định'],['Free Fund','Quỹ tự do'],['Fixed:','Quỹ cố định:'],['Free:','Quỹ tự do:'],['Broadcast','Thông báo hàng loạt'],['Ticket','Yêu cầu hỗ trợ'],['ticket','yêu cầu hỗ trợ'],['ledger','sổ giao dịch'],['User','Người dùng'],['Admin CRM','Quản trị hệ thống'],['Admin','Quản trị'],['Demo','mô phỏng'],['demo','mô phỏng'],['Pending','chờ xử lý'],['provider','nhà cung cấp']];
export function localize(value: string, locale: string): string {
 const index=locale==='en-US'?1:0;
 if(dictionary[value])return dictionary[value][index];
 const operation=value.split(' · ')[0];
 if(dictionary[operation]&&operation.includes('.'))return dictionary[operation][index]+value.slice(operation.length);
 // These are generated finance descriptions; user-authored notes are otherwise preserved.
 const prefixes: [string,string][]=[['Nhận từ ','Received from '],['Góp quỹ · ','Fund contribution · '],['Chi quỹ · ','Fund expense · '],['Hoàn quỹ · ','Fund refund · '],['Giải tán quỹ · ','Fund dissolved · '],['Mục tiêu · ','Goal · '],['Nạp tiền · ','Top-up · '],['Ngân hàng Demo · ','Demo bank · ']];
 for(const [vi,en] of prefixes)if(value.startsWith(vi))return(index?en:vi.replace('Demo','mô phỏng'))+localize(value.slice(vi.length),locale);
 for(const [key,pair] of Object.entries(messages))if(value.includes(key))return value.replace(key,pair[index]);
 return value;
}
export function useCopy(){const {locale}=useI18n();return (vi:string,en?:string)=>{const text=en===undefined?localize(vi,locale):locale==='en-US'?en:vi;if(locale==='en-US'||(en===undefined&&!(vi in dictionary)&&text===vi))return text;return terminology.reduce((s,[from,to])=>s.replaceAll(from,to),text);};}
