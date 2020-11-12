namespace :auto_record do
  desc "1日に1度、その日と同じ日にちのレコードを入力する"
  
  task create_book: :environment do
    autoRecord = AutoRecord.all
    day = Date.today.day
    end_of_month = Time.current.end_of_month.day
    autoRecord.each do |record|
      if record.date.to_i > end_of_month
        record.date = end_of_month
      end
      if day == record.date.to_i
        today = "#{Date.today.year}-#{Date.today.month}-#{Date.today.day}"
        Book.create(name: record.name, money: record.money, date: today, item_id: record.item_id, user_id: record.user_id)
      end
    end
  end

end
