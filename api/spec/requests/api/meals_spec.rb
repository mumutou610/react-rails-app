require 'rails_helper'

RSpec.describe 'Api::Meals', type: :request do
  describe 'GET /api/meals' do
    it '200を返す' do
      create_list(:meal, 3)
      get '/api/meals'
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).length).to eq(3)
    end
  end

  describe 'GET /api/meals/:id' do
    let(:meal) { create(:meal) }

    it '200を返す' do
      get "/api/meals/#{meal.id}"
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['id']).to eq(meal.id)
    end
  end

  describe 'POST /api/meals' do
    context '有効なパラメータ' do
      let(:valid_params) do
        { meal: { description: '玄米ご飯', eaten_at: Date.today } }
      end

      it '201を返してレコードが増える' do
        expect {
          post '/api/meals', params: valid_params, as: :json
        }.to change(Meal, :count).by(1)
        expect(response).to have_http_status(:created)
      end
    end

    context '無効なパラメータ' do
      let(:invalid_params) do
        { meal: { description: '', eaten_at: nil } }
      end

      it '422を返す' do
        post '/api/meals', params: invalid_params, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)).to have_key('errors')
      end
    end
  end

  describe 'PATCH /api/meals/:id' do
    let(:meal) { create(:meal) }

    it '200を返してdescriptionが更新される' do
      patch "/api/meals/#{meal.id}",
            params: { meal: { description: '更新後の食事' } },
            as: :json
      expect(response).to have_http_status(:ok)
      expect(meal.reload.description).to eq('更新後の食事')
    end
  end

  describe 'DELETE /api/meals/:id' do
    let!(:meal) { create(:meal) }

    it '204を返してレコードが減る' do
      expect {
        delete "/api/meals/#{meal.id}"
      }.to change(Meal, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end
end
