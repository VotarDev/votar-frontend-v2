import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

type Country = {
  value: string;
  label: string;
};
const BillingAddress = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countriesData = response.data.map((country: any) => ({
          value: country.name.common,
          label: country.name.common,
        }));
        setCountries(countriesData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCountries();
  }, []);

  const handleCountryChange = (selectedOption: Country | null) => {
    setSelectedCountry(selectedOption);
  };
  return (
    <div>
      <div className="max-w-[1000px]">
        <h1 className="text-2xl pb-5 pt-10">Billing Address</h1>
        <div className="max-w-[45rem] flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center">
              <label className="flex-1">First Name</label>
              <div className="flex-1">
                <input
                  type="text"
                  className="border w-full px-4 py-1 outline-none"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <label className="flex-1">Last Name</label>
            <div className="flex-1">
              <input
                type="text"
                className="border w-full px-4 py-1 outline-none"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <label className="flex-1">Address</label>
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  className="border w-full px-4 py-1 outline-none"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  className="border w-full px-4 py-1 outline-none"
                  placeholder="Address Line 2"
                />
                <span className="absolute -right-24 top-1/2 -translate-y-1/2 text-sm">
                  OPTIONAL
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <label className="flex-1">City</label>
            <div className="flex-1">
              <input
                type="text"
                className="border w-full px-4 py-1 outline-none"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <label className="flex-1">State/Province</label>
            <div className="flex-1">
              <input
                type="text"
                className="border w-full px-4 py-1 outline-none"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <label className="flex-1">ZIP/Postal Code</label>
            <div className="flex-1">
              <input
                type="text"
                className="border w-full px-4 py-1 outline-none"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <label className="flex-1">Country</label>
            <div className="flex-1">
              <Select
                value={selectedCountry}
                onChange={handleCountryChange}
                options={countries}
                styles={{
                  container: (base) => ({
                    ...base,
                    flex: 1,

                    width: "max-content",
                    minWidth: "100%",
                    margin: "0",
                    padding: "0",
                  }),
                }}
                placeholder="Select your country"
                className="w-full px-4 py-1 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingAddress;
