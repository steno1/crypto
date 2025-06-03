import { Form } from 'react-bootstrap';

interface CurrencySelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ value, onChange, className }) => (
  <Form.Select
    size="sm"
    className={className}
    value={value}
    onChange={onChange}
    aria-label="Select currency"
  >
    <option value="usd">USD</option>
    <option value="eur">EUR</option>
    <option value="btc">BTC</option>
  </Form.Select>
);

export default CurrencySelector;
