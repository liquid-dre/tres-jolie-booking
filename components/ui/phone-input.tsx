"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const COUNTRIES = [
  { code: "ZA", name: "South Africa", dial: "+27", flag: "\u{1F1FF}\u{1F1E6}" },
  { code: "US", name: "United States", dial: "+1", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "AU", name: "Australia", dial: "+61", flag: "\u{1F1E6}\u{1F1FA}" },
  { code: "CA", name: "Canada", dial: "+1", flag: "\u{1F1E8}\u{1F1E6}" },
  { code: "DE", name: "Germany", dial: "+49", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "FR", name: "France", dial: "+33", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "IT", name: "Italy", dial: "+39", flag: "\u{1F1EE}\u{1F1F9}" },
  { code: "ES", name: "Spain", dial: "+34", flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "PT", name: "Portugal", dial: "+351", flag: "\u{1F1F5}\u{1F1F9}" },
  { code: "NL", name: "Netherlands", dial: "+31", flag: "\u{1F1F3}\u{1F1F1}" },
  { code: "BE", name: "Belgium", dial: "+32", flag: "\u{1F1E7}\u{1F1EA}" },
  { code: "CH", name: "Switzerland", dial: "+41", flag: "\u{1F1E8}\u{1F1ED}" },
  { code: "AT", name: "Austria", dial: "+43", flag: "\u{1F1E6}\u{1F1F9}" },
  { code: "SE", name: "Sweden", dial: "+46", flag: "\u{1F1F8}\u{1F1EA}" },
  { code: "NO", name: "Norway", dial: "+47", flag: "\u{1F1F3}\u{1F1F4}" },
  { code: "DK", name: "Denmark", dial: "+45", flag: "\u{1F1E9}\u{1F1F0}" },
  { code: "IE", name: "Ireland", dial: "+353", flag: "\u{1F1EE}\u{1F1EA}" },
  { code: "NZ", name: "New Zealand", dial: "+64", flag: "\u{1F1F3}\u{1F1FF}" },
  { code: "IN", name: "India", dial: "+91", flag: "\u{1F1EE}\u{1F1F3}" },
  { code: "CN", name: "China", dial: "+86", flag: "\u{1F1E8}\u{1F1F3}" },
  { code: "JP", name: "Japan", dial: "+81", flag: "\u{1F1EF}\u{1F1F5}" },
  { code: "KR", name: "South Korea", dial: "+82", flag: "\u{1F1F0}\u{1F1F7}" },
  { code: "AE", name: "UAE", dial: "+971", flag: "\u{1F1E6}\u{1F1EA}" },
  { code: "SA", name: "Saudi Arabia", dial: "+966", flag: "\u{1F1F8}\u{1F1E6}" },
  { code: "BR", name: "Brazil", dial: "+55", flag: "\u{1F1E7}\u{1F1F7}" },
  { code: "MX", name: "Mexico", dial: "+52", flag: "\u{1F1F2}\u{1F1FD}" },
  { code: "NG", name: "Nigeria", dial: "+234", flag: "\u{1F1F3}\u{1F1EC}" },
  { code: "KE", name: "Kenya", dial: "+254", flag: "\u{1F1F0}\u{1F1EA}" },
  { code: "GH", name: "Ghana", dial: "+233", flag: "\u{1F1EC}\u{1F1ED}" },
  { code: "BW", name: "Botswana", dial: "+267", flag: "\u{1F1E7}\u{1F1FC}" },
  { code: "MZ", name: "Mozambique", dial: "+258", flag: "\u{1F1F2}\u{1F1FF}" },
  { code: "ZW", name: "Zimbabwe", dial: "+263", flag: "\u{1F1FF}\u{1F1FC}" },
  { code: "NA", name: "Namibia", dial: "+264", flag: "\u{1F1F3}\u{1F1E6}" },
  { code: "SZ", name: "Eswatini", dial: "+268", flag: "\u{1F1F8}\u{1F1FF}" },
  { code: "LS", name: "Lesotho", dial: "+266", flag: "\u{1F1F1}\u{1F1F8}" },
] as const;

type PhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  "aria-invalid"?: boolean;
};

function matchCountry(phone: string) {
  if (!phone) return null;
  const sorted = [...COUNTRIES].sort(
    (a, b) => b.dial.length - a.dial.length
  );
  for (const country of sorted) {
    if (phone.startsWith(country.dial)) {
      return country;
    }
  }
  return null;
}

export function PhoneInput({ value, onChange, id, "aria-invalid": ariaInvalid }: PhoneInputProps) {
  const [countryCode, setCountryCode] = React.useState("ZA");

  // Sync country code when value changes externally
  React.useEffect(() => {
    const match = matchCountry(value);
    if (match) setCountryCode(match.code);
  }, [value]);

  const selectedCountry =
    COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES[0];

  const localNumber = value && value.startsWith(selectedCountry.dial)
    ? value.slice(selectedCountry.dial.length)
    : value
      ? (matchCountry(value)
          ? value.slice(matchCountry(value)!.dial.length)
          : value.replace(/^\+/, ""))
      : "";

  function handleCountryChange(code: string | null) {
    if (!code) return;
    const country = COUNTRIES.find((c) => c.code === code);
    if (!country) return;
    setCountryCode(code);
    onChange(localNumber ? `${country.dial}${localNumber}` : "");
  }

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const num = e.target.value.replace(/[^\d]/g, "");
    onChange(num ? `${selectedCountry.dial}${num}` : "");
  }

  return (
    <div className="flex gap-2">
      <Select value={countryCode} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[120px] shrink-0">
          <SelectValue>
            {selectedCountry.flag} {selectedCountry.dial}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="w-[280px]">
          {COUNTRIES.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.flag} {country.name} ({country.dial})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        id={id}
        type="tel"
        value={localNumber}
        onChange={handleNumberChange}
        placeholder="Phone number"
        className="flex-1"
        aria-invalid={ariaInvalid}
      />
    </div>
  );
}
