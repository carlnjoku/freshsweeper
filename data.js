
export const propertyList = [
    { 
      label: 'Select Apartment type', 
      value: '#' },
    {
      label: "House",
      value: "house",
    },
    {
      label: "Apartment",
      value: "apartment",
    },
    {
      label: "Studio Apartment",
      value: "studio",
    },
    {
      label: "Cabin",
      value: "cabin",
    },
    {
      label: "Lighthouse",
      value: "lighthouse",
    },
    {
      label: "Bungalow",
      value: "Bungalow",
    },
    {
      label: "Basement Apartment",
      value: "basement",
    },
    {
      label: "Loft",
      value: "loft",
    },
    {
      label: "Condo",
      value: "condo",
    },
    {
      label: "Cottage",
      value: "cottage",
    },
    {
      label: "TownHouse",
      value: "townHouse",
    },
    {
      label: "Mansion",
      value: "mansion",
    },
    
    
  ];
// Regular cleaning tasks
export const regular_cleaning = [
    {
        "label":"Sweeping and Mopping",
        "value":"Sweeping and Mopping",
    },
    {
        "label":"Vacuuming",
        "value":"Vacuuming"
    },
    {
        "label":"Kitchen Cleaning",
        "value":"Kitchen"
    },
    {
        "label":"Bathroom Cleaning",
        "value":"Bathroom "
    },
    {
        "label":"Dishwashing",
        "value":"Dishwashing"
    },
    {
        "label":"Trash Removal",
        "value":"Trash Removal"
    },
    {
        "label":"Room Cleaning",
        "value":"Room Cleaning"
    },
    {
        "label":"Livingroom",
        "value":"Livingroom"
    },
    {
        "label":"Window Cleaning",
        "value":"Window Cleaning"
    },
    {
        "label":"Air Freshening",
        "value":"Air Freshening"
    },
    {
        "label":"Appliance Cleaning",
        "value":"Appliance Cleaning"
    },
    {
        "label":"Final Inspection",
        "value":"Final Inspection"
    },
    {
        "label":"Dusting",
        "value":"Dusting"
    },
    
    
]

export const  task_checklist = [
    {
        id:1,
        title:"Living Room",
        value:[
            {
                id:1,
                label:"Dust Furniture & Electronics",
                value:"dust_furniture_electronics",
            },
            {
                id:2,
                label:"Vacuum Or Mop",
                value:"vacuum_mop",
            },
            {
                id:3,
                label:"Wipe Down",
                value:"wipe_down",
            },
            {
                id:4,
                label:"Clean Rug Or Upholstered Furniture",
                value:"rug_upholstered_furnture",
            },
        ]
    },
    {
        id:2,
        title:"Kitchen",
        value:[
            {
                id:1,
                label:"Clean Counter & Appliances",
                value:"counter_appliances",
            },
            {
                id:2,
                label:"Wipe Down Sink & Stove",
                value:"wipe_sink_stove",
            },
            {
                id:3,
                label:"Sweep & Mop Floor",
                value:"sweep_mop",
            },
            {
                id:4,
                label:"Clean Refigerator, Oven & Cabinets",
                value:"frige_oven_carbinet",
            },
        ]
    },
    {
        id:3,
        title:"Bathroom",
        value:[
            {
                id:1,
                label:"Clean Sink, Toilet, Shower, Bathtub & Mirror",
                value:"sink_toilet_dhower_bathtub_mirror",
            },
            {
                id:2,
                label:"Wipe Down Surfaces With Disinfectant",
                value:"wipe_disinfectant",
            },
            {
                id:3,
                label:"Sweep & Mop Floor",
                value:"sweep_mop",
            },
            {
                id:4,
                label:"Clean Bathroom Trash",
                value:"bathroom_rash",
            },
        ]
    },
    {
        id:3,
        title:"Bedroom",
        value:[
            {
                id:1,
                label:"Make Bed",
                value:"make_bed",
            },
            {
                id:2,
                label:"Dust Furniture & Electronics",
                value:"dust_furniture_electronics",
            },
            {
                id:3,
                label:"Vacuum & Mop Floor",
                value:"vacuum_mop",
            },
            {
                id:4,
                label:"Wipe Down Surfaces",
                value:"wipe_down",
            },
        ]
    },
    {
        id:5,
        title:"Hallway",
        value:[
            {
                id:1,
                label:"Dust Banisters & Light Fixtures",
                value:"banisters_light_fixtures",
            },
            {
                id:3,
                label:"Vacuum & Sweep Floor",
                value:"vacuum_sweep",
            },
            
        ]
    },
]








// Verification items data
export const verification_items = [
    
    {
        id: 1,
        label: "Identity Verification",
        description: "Upload a government-issued ID document",
        icon: "id-card",
        status: "none",
        type: "ID_verify",
    },
    {
        id: 2,
        label: "Payment",
        description: "Select you payout method",
        icon: "credit-card",
        status: "none",
        type: "payment_onboarding",
    },
    {
        id: 3,
        label: "Tax Information",
        description: "Upload a government-issued ID document",
        icon: "file-document",
        status: "none",
        type: "tax_info",
    },
];

export const us_states = [
    {
        "name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "name": "Alaska",
        "abbreviation": "AK"
    },
    {
        "name": "American Samoa",
        "abbreviation": "AS"
    },
    {
        "name": "Arizona",
        "abbreviation": "AZ"
    },
    {
        "name": "Arkansas",
        "abbreviation": "AR"
    },
    {
        "name": "California",
        "abbreviation": "CA"
    },
    {
        "name": "Colorado",
        "abbreviation": "CO"
    },
    {
        "name": "Connecticut",
        "abbreviation": "CT"
    },
    {
        "name": "Delaware",
        "abbreviation": "DE"
    },
    {
        "name": "District Of Columbia",
        "abbreviation": "DC"
    },
    {
        "name": "Federated States Of Micronesia",
        "abbreviation": "FM"
    },
    {
        "name": "Florida",
        "abbreviation": "FL"
    },
    {
        "name": "Georgia",
        "abbreviation": "GA"
    },
    {
        "name": "Guam",
        "abbreviation": "GU"
    },
    {
        "name": "Hawaii",
        "abbreviation": "HI"
    },
    {
        "name": "Idaho",
        "abbreviation": "ID"
    },
    {
        "name": "Illinois",
        "abbreviation": "IL"
    },
    {
        "name": "Indiana",
        "abbreviation": "IN"
    },
    {
        "name": "Iowa",
        "abbreviation": "IA"
    },
    {
        "name": "Kansas",
        "abbreviation": "KS"
    },
    {
        "name": "Kentucky",
        "abbreviation": "KY"
    },
    {
        "name": "Louisiana",
        "abbreviation": "LA"
    },
    {
        "name": "Maine",
        "abbreviation": "ME"
    },
    {
        "name": "Marshall Islands",
        "abbreviation": "MH"
    },
    {
        "name": "Maryland",
        "abbreviation": "MD"
    },
    {
        "name": "Massachusetts",
        "abbreviation": "MA"
    },
    {
        "name": "Michigan",
        "abbreviation": "MI"
    },
    {
        "name": "Minnesota",
        "abbreviation": "MN"
    },
    {
        "name": "Mississippi",
        "abbreviation": "MS"
    },
    {
        "name": "Missouri",
        "abbreviation": "MO"
    },
    {
        "name": "Montana",
        "abbreviation": "MT"
    },
    {
        "name": "Nebraska",
        "abbreviation": "NE"
    },
    {
        "name": "Nevada",
        "abbreviation": "NV"
    },
    {
        "name": "New Hampshire",
        "abbreviation": "NH"
    },
    {
        "name": "New Jersey",
        "abbreviation": "NJ"
    },
    {
        "name": "New Mexico",
        "abbreviation": "NM"
    },
    {
        "name": "New York",
        "abbreviation": "NY"
    },
    {
        "name": "North Carolina",
        "abbreviation": "NC"
    },
    {
        "name": "North Dakota",
        "abbreviation": "ND"
    },
    {
        "name": "Northern Mariana Islands",
        "abbreviation": "MP"
    },
    {
        "name": "Ohio",
        "abbreviation": "OH"
    },
    {
        "name": "Oklahoma",
        "abbreviation": "OK"
    },
    {
        "name": "Oregon",
        "abbreviation": "OR"
    },
    {
        "name": "Palau",
        "abbreviation": "PW"
    },
    {
        "name": "Pennsylvania",
        "abbreviation": "PA"
    },
    {
        "name": "Puerto Rico",
        "abbreviation": "PR"
    },
    {
        "name": "Rhode Island",
        "abbreviation": "RI"
    },
    {
        "name": "South Carolina",
        "abbreviation": "SC"
    },
    {
        "name": "South Dakota",
        "abbreviation": "SD"
    },
    {
        "name": "Tennessee",
        "abbreviation": "TN"
    },
    {
        "name": "Texas",
        "abbreviation": "TX"
    },
    {
        "name": "Utah",
        "abbreviation": "UT"
    },
    {
        "name": "Vermont",
        "abbreviation": "VT"
    },
    {
        "name": "Virgin Islands",
        "abbreviation": "VI"
    },
    {
        "name": "Virginia",
        "abbreviation": "VA"
    },
    {
        "name": "Washington",
        "abbreviation": "WA"
    },
    {
        "name": "West Virginia",
        "abbreviation": "WV"
    },
    {
        "name": "Wisconsin",
        "abbreviation": "WI"
    },
    {
        "name": "Wyoming",
        "abbreviation": "WY"
    }
]


export const entities = [
    
    {
        label:"Individual", 
        value:"individual" 
    },
    {
        label:"Limited Liability Company", 
        value:"llc"
    },
    {
        label:"S Corporation", 
        value:"scorporation" 
    },
    {
        label:"C Corporation", 
        value:"ccorporation"
    },
    {
        label:"Partnership", 
        value:"partnership"
    },
    {
        label:"Sole Proprietorship", 
        value:"sole_proprietorship",
    }
]


export const countryCurrencyMap = {
    US: { currency: 'USD', symbol: '$' },
    CA: { currency: 'CAD', symbol: 'CA$' },
    GB: { currency: 'GBP', symbol: '£' },
    NG: { currency: 'NGN', symbol: '₦' },
    FR: { currency: 'EUR', symbol: '€' },
    DE: { currency: 'EUR', symbol: '€' },
    IN: { currency: 'INR', symbol: '₹' },
    JP: { currency: 'JPY', symbol: '¥' },
    AU: { currency: 'AUD', symbol: 'A$' },
    // Add more as needed
  };