const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Get Connected API',
      version: '1.0.0',
      description: 'API documentation for the Get Connected application',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'The user ID'
          },
          name: {
            type: 'string',
            description: 'The name of the user'
          },
          phoneNumber: {
            type: 'string',
            description: 'The phone number of the user'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'The email of the user'
          },
          companyName: {
            type: 'string',
            description: 'The company name of the user'
          },
          logo: {
            type: 'string',
            description: 'The logo of the user'
          },
          timezone: {
            type: 'string',
            description: 'The timezone of the user'
          },
          role: {
            type: 'string',
            description: 'The role of the user (USER, ADMIN)'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'The date and time the user was created'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'The date and time the user was updated'
          }
        },
        required: [
          'name',
          'phoneNumber'
        ]
      },
      Contact: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'The contact ID'
          },
          name: {
            type: 'string',
            description: 'The name of the contact'
          },
          phoneNumber: {
            type: 'string',
            description: 'The phone number of the contact'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'The email of the contact'
          },
          address: {
            type: 'string',
            description: 'The address of the contact'
          },
          tags: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'The tags of the contact'
          },
          notes: {
            type: 'string',
            description: 'The notes of the contact'
          },
          status: {
            type: 'string',
            description: 'The status of the contact (lead, client, former_client)'
          },
          pipelineStage: {
            type: 'string',
            description: 'The pipeline stage of the contact'
          },
          createdBy: {
            type: 'string',
            format: 'uuid',
            description: 'The ID of the user who created the contact'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'The date and time the contact was created'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'The date and time the contact was updated'
          }
        },
        required: [
          'name',
          'phoneNumber',
          'createdBy'
        ]
      },
      CalendarEvent: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'The calendar event ID'
          },
          title: {
            type: 'string',
            description: 'The title of the calendar event'
          },
          description: {
            type: 'string',
            description: 'The description of the calendar event'
          },
          startTime: {
            type: 'string',
            format: 'date-time',
            description: 'The start time of the calendar event'
          },
          endTime: {
            type: 'string',
            format: 'date-time',
            description: 'The end time of the calendar event'
          },
          location: {
            type: 'string',
            description: 'The location of the calendar event'
          },
          eventType: {
            type: 'string',
            description: 'The event type of the calendar event (meeting, other)'
          },
          relatedId: {
            type: 'string',
            format: 'uuid',
            description: 'The ID of the related job or estimate'
          },
          createdBy: {
            type: 'string',
            format: 'uuid',
            description: 'The ID of the user who created the calendar event'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'The date and time the calendar event was created'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'The date and time the calendar event was updated'
          }
        },
        required: [
          'title',
          'startTime',
          'endTime',
          'eventType',
          'createdBy'
        ]
      },
      AiMessage: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'The unique identifier for the AI message'
          },
          message: {
            type: 'string',
            description: 'The content of the message'
          },
          senderType: {
            type: 'string',
            enum: ['AI', 'USER'],
            description: 'Indicates whether the message was sent by the AI or the User'
          },
          userId: {
            type: 'string',
            format: 'uuid',
            description: 'The ID of the user associated with this conversation thread'
          },
          contactId: {
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'The ID of the contact this message relates to'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'The date and time the message was created'
          },
          // Optional: Include related data if returned by API endpoints
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' }
            },
            description: 'Basic info of the associated user (if included in response)'
          },
          contact: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' }
            },
            description: 'Basic info of the associated contact (if included in response)'
          }
        },
        required: [
          'id',
          'message',
          'senderType',
          'userId',
          'createdAt'
          // contactId is required for saving, but might be null in some contexts? Adjust if needed.
        ]
      },
      InvestmentCalculation: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'The investment calculation ID'
          },
          propertyType: {
            type: 'string',
            description: 'Type of property (e.g., "Single Family Residence")'
          },
          marketArea: {
            type: 'string',
            description: 'Market area (e.g., "Indianapolis, IN")'
          },
          investmentAmount: {
            type: 'number',
            format: 'float',
            description: 'Investment amount (e.g., 100000)'
          },
          holdPeriod: {
            type: 'integer',
            description: 'Hold period in years (e.g., 5)'
          },
          annualReturnRate: {
            type: 'number',
            format: 'float',
            description: 'Annual return rate as percentage (e.g., 10.0)'
          },
          propertyManagementFee: {
            type: 'number',
            format: 'float',
            description: 'Property management fee as percentage (e.g., 8.0)'
          },
          vacancyRate: {
            type: 'number',
            format: 'float',
            description: 'Vacancy rate as percentage (e.g., 5.0)'
          },
          monthlyCashFlow: {
            type: 'number',
            format: 'float',
            description: 'Monthly cash flow (e.g., 725)'
          },
          annualCashFlow: {
            type: 'number',
            format: 'float',
            description: 'Annual cash flow (e.g., 8700)'
          },
          totalReturn: {
            type: 'number',
            format: 'float',
            description: 'Total return (e.g., 43500)'
          },
          roi: {
            type: 'number',
            format: 'float',
            description: 'ROI as percentage (e.g., 43.5)'
          },
          notes: {
            type: 'string',
            description: 'Additional notes'
          },
          contactId: {
            type: 'string',
            format: 'uuid',
            description: 'The ID of the contact this calculation is for'
          },
          createdBy: {
            type: 'string',
            format: 'uuid',
            description: 'The ID of the user who created this calculation'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'The date and time the calculation was created'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'The date and time the calculation was updated'
          },
          contact: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'The ID of the contact'
              },
              name: {
                type: 'string',
                description: 'The name of the contact'
              },
              phoneNumber: {
                type: 'string',
                description: 'The phone number of the contact'
              },
              email: {
                type: 'string',
                format: 'email',
                description: 'The email of the contact'
              }
            },
            description: 'Basic info of the associated contact (if included in response)'
          },
          user: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'The ID of the user'
              },
              name: {
                type: 'string',
                description: 'The name of the user'
              }
            },
            description: 'Basic info of the associated user (if included in response)'
          }
        },
        required: [
          'propertyType',
          'marketArea',
          'investmentAmount',
          'holdPeriod',
          'annualReturnRate',
          'propertyManagementFee',
          'vacancyRate',
          'monthlyCashFlow',
          'annualCashFlow',
          'totalReturn',
          'roi',
          'contactId',
          'createdBy'
        ]
      },
      InvestorQuestionnaire: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'The investor questionnaire ID'
          },
          isAccreditedInvestor: {
            type: 'boolean',
            description: 'Whether the investor is accredited'
          },
          hasInvestedBefore: {
            type: 'boolean',
            description: 'Whether the investor has invested in real estate before'
          },
          lookingTimeframe: {
            type: 'string',
            description: 'How long they have been looking to invest in real estate'
          },
          primaryInvestmentGoal: {
            type: 'string',
            description: 'Primary investment goal'
          },
          investmentTimeline: {
            type: 'string',
            description: 'Investment timeline'
          },
          capitalToInvest: {
            type: 'string',
            description: 'How much capital they are looking to invest'
          },
          useFinancing: {
            type: 'string',
            description: 'Whether they plan to use financing'
          },
          marketsInterested: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Markets they are interested in investing in'
          },
          propertyTypesInterested: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Property types they are interested in'
          },
          investmentTimeframe: {
            type: 'string',
            description: 'When they plan to make their first/next investment'
          },
          notes: {
            type: 'string',
            description: 'Additional notes'
          },
          contactId: {
            type: 'string',
            format: 'uuid',
            description: 'The ID of the contact this questionnaire is for'
          },
          createdBy: {
            type: 'string',
            format: 'uuid',
            description: 'The ID of the user who created this questionnaire'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'The date and time the questionnaire was created'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'The date and time the questionnaire was updated'
          },
          contact: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'The ID of the contact'
              },
              name: {
                type: 'string',
                description: 'The name of the contact'
              },
              phoneNumber: {
                type: 'string',
                description: 'The phone number of the contact'
              },
              email: {
                type: 'string',
                format: 'email',
                description: 'The email of the contact'
              }
            },
            description: 'Basic info of the associated contact (if included in response)'
          },
          user: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'The ID of the user'
              },
              name: {
                type: 'string',
                description: 'The name of the user'
              }
            },
            description: 'Basic info of the associated user (if included in response)'
          }
        },
        required: [
          'isAccreditedInvestor',
          'hasInvestedBefore',
          'lookingTimeframe',
          'primaryInvestmentGoal',
          'investmentTimeline',
          'capitalToInvest',
          'useFinancing',
          'marketsInterested',
          'propertyTypesInterested',
          'investmentTimeframe',
          'contactId',
          'createdBy'
        ]
      },
      Video: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'The video ID'
          },
          title: {
            type: 'string',
            description: 'Title of the video'
          },
          videoUrl: {
            type: 'string',
            description: 'URL to the video (YouTube, Vimeo, or hosted URL)'
          },
          thumbnailUrl: {
            type: 'string',
            description: 'URL to the video thumbnail image'
          },
          isPublished: {
            type: 'boolean',
            description: 'Whether the video is publicly available'
          },
          createdBy: {
            type: 'string',
            format: 'uuid',
            description: 'The ID of the user who created the video'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'The date and time the video was created'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'The date and time the video was updated'
          },
          user: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'The ID of the user'
              },
              name: {
                type: 'string',
                description: 'The name of the user'
              }
            },
            description: 'Basic info of the associated user (if included in response)'
          }
        },
        required: [
          'title',
          'videoUrl',
          'createdBy'
        ]
      },
      VideoFeedback: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'The video feedback ID'
          },
          videoId: {
            type: 'string',
            format: 'uuid',
            description: 'ID of the video this feedback is for'
          },
          responses: {
            type: 'object',
            description: 'JSON object containing question/answer pairs'
          },
          contactId: {
            type: 'string',
            format: 'uuid',
            description: 'Optional ID of the contact this feedback is for'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'The date and time the feedback was created'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'The date and time the feedback was updated'
          },
          video: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'The ID of the video'
              },
              title: {
                type: 'string',
                description: 'The title of the video'
              },
              videoUrl: {
                type: 'string',
                description: 'URL to the video'
              },
              thumbnailUrl: {
                type: 'string',
                description: 'URL to the video thumbnail'
              }
            },
            description: 'Basic info of the associated video (if included in response)'
          },
          contact: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'The ID of the contact'
              },
              name: {
                type: 'string',
                description: 'The name of the contact'
              },
              phoneNumber: {
                type: 'string',
                description: 'The phone number of the contact'
              },
              email: {
                type: 'string',
                format: 'email',
                description: 'The email of the contact'
              }
            },
            description: 'Basic info of the associated contact (if included in response)'
          }
        },
        required: [
          'videoId',
          'responses'
        ]
      }
    }
  }
};

const specs = swaggerJsdoc(options);

module.exports = specs;
