
import { Form } from 'react-bootstrap';

interface CurrencySelectorProps {
  currency: string;
  onCurrencyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ currency, onCurrencyChange, className }) => (
  <Form.Select
    size="sm"
    className={className}
    value={currency}
    onChange={onCurrencyChange}
    aria-label="Select currency"
  >
    <option value="usd">USD</option>
    <option value="eur">EUR</option>
    <option value="btc">BTC</option>
  </Form.Select>
);

export default CurrencySelector;
