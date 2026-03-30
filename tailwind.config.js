import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(__dirname, "index.html"),
    path.join(__dirname, "src/**/*.{js,ts,jsx,tsx}"),
  ],
  darkMode: ['class'],
  theme: {
  	screens: {
  		xs: '375px',
  		sm: '640px',
  		md: '768px',
  		lg: '1024px',
  		xl: '1280px',
  		'2xl': '1536px'
  	},
  	extend: {
  		colors: {
  			/* ── Core semantic tokens (from CSS vars) ── */
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			page: 'hsl(var(--page))',
  			surface: 'hsl(var(--surface))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))'
  			},
  			warning: {
  				DEFAULT: 'hsl(var(--warning))',
  				foreground: 'hsl(var(--warning-foreground))'
  			},
  			info: {
  				DEFAULT: 'hsl(var(--info))',
  				foreground: 'hsl(var(--info-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},

  			/* ── RUCompliant brand palette (direct hex) ── */
  			magenta: {
  				50: '#FDE8EF',
  				100: '#FBD1DF',
  				200: '#F7A3BF',
  				300: '#F2759F',
  				400: '#E43F6F',
  				DEFAULT: '#E43F6F',
  				500: '#D1325F',
  				600: '#B5294F',
  				700: '#8F1F3D',
  				800: '#69162D',
  				900: '#430E1D',
  			},
  			dusk: {
  				50: '#E8EDF5',
  				100: '#D1DBEB',
  				200: '#A3B7D7',
  				300: '#7593C3',
  				400: '#4A70AB',
  				DEFAULT: '#345995',
  				500: '#345995',
  				600: '#2B4A7B',
  				700: '#213A61',
  				800: '#172B47',
  				900: '#0E1B2D',
  			},
  			emerald: {
  				50: '#E8F8F0',
  				100: '#D1F1E1',
  				200: '#A3E3C3',
  				300: '#75D5A5',
  				400: '#48BF84',
  				DEFAULT: '#48BF84',
  				500: '#3AA36F',
  				600: '#2D875A',
  				700: '#1F6B45',
  				800: '#124F30',
  				900: '#04331B',
  			},

  			/* ── RAG status tokens ── */
  			'status-green': 'hsl(var(--status-green))',
  			'status-amber': 'hsl(var(--status-amber))',
  			'status-red': 'hsl(var(--status-red))',
  		},
  		fontFamily: {
  			sans: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
  			display: "'Manrope', sans-serif"
  		},
  		fontSize: {
  			'2xs': ['var(--font-size-2xs)', { lineHeight: '1.25' }],
  			xs: ['var(--font-size-xs)', { lineHeight: 'var(--line-height-tight)' }],
  			sm: ['var(--font-size-sm)', { lineHeight: '1.375' }],
  			base: ['var(--font-size-base)', { lineHeight: 'var(--line-height-normal)' }],
  			lg: ['var(--font-size-lg)', { lineHeight: 'var(--line-height-relaxed)' }],
  			xl: ['var(--font-size-xl)', { lineHeight: 'var(--line-height-relaxed)' }],
  			'2xl': ['var(--font-size-2xl)', { lineHeight: 'var(--line-height-tight)' }],
  			'3xl': ['var(--font-size-3xl)', { lineHeight: 'var(--line-height-tight)' }],
  			'4xl': ['var(--font-size-4xl)', { lineHeight: 'var(--line-height-tight)' }]
  		},
  		spacing: {
  			'18': '4.5rem',
  			'22': '5.5rem',
  			'safe-bottom': 'env(safe-area-inset-bottom)',
  			'safe-top': 'env(safe-area-inset-top)'
  		},
  		maxWidth: {
  			content: '1120px',
  		},
  		minHeight: {
  			'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			xl: '1rem',
  			'2xl': '1.5rem',
  			pill: '9999px'
  		},
  		borderWidth: {
  			DEFAULT: '0.5px',
  			'0': '0',
  			'1': '1px',
  			'2': '2px',
  			'4': '4px',
  		},
  		boxShadow: {
  			'none': 'none',
  			'advisor': 'var(--shadow-advisor)',
  			'focus': 'var(--shadow-focus)',
  		},
  		backgroundImage: {
  			'hero-soft': 'linear-gradient(135deg, hsl(var(--primary) / 0.05) 0%, hsl(var(--primary) / 0.02) 50%, hsl(var(--page)) 100%)',
  			'gradient-button': 'linear-gradient(135deg, hsl(var(--primary) / 0.9) 0%, hsl(var(--primary)) 100%)',
  			'gradient-primary': 'linear-gradient(to bottom right, hsl(var(--primary) / 0.5), hsl(var(--primary)))',
  			'gradient-success': 'linear-gradient(to bottom right, hsl(var(--success) / 0.5), hsl(var(--success)))',
  		},
  		keyframes: {
  			'bounce-in': {
  				'0%': { transform: 'scale(0)', opacity: '0' },
  				'50%': { transform: 'scale(1.2)' },
  				'100%': { transform: 'scale(1)', opacity: '1' }
  			},
  			'pulse-soft': {
  				'0%, 100%': { opacity: '1' },
  				'50%': { opacity: '0.7' }
  			},
  			'slide-up': {
  				'0%': { transform: 'translateY(10px)', opacity: '0' },
  				'100%': { transform: 'translateY(0)', opacity: '1' }
  			},
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			}
  		},
  		animation: {
  			'bounce-in': 'bounce-in 0.6s ease-out forwards',
  			'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
  			'slide-up': 'slide-up 0.3s ease-out forwards',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		transitionDuration: {
  			'250': '250ms',
  			'350': '350ms'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
